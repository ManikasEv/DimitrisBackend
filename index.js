import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser'; // Import bodyParser
import Admin from "./models/admin.model.js";
import bcrypt from 'bcrypt'; // Import bcrypt

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Your existing routes
app.get('/', (req, res) => {
    res.send('Hello from Node API');
});

// POST route to handle admin registration
app.post('/api/Admin', async (req, res) => {
    const { firstName, lastName, email, password, telephone, address } = req.body;

    try {
        // Check if all fields are provided
        if (!firstName || !lastName || !email || !password || !telephone || !address) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Admin document
        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            telephone,
            address,
            password: hashedPassword, // Save the hashed password
        });

        // Save the new admin to the database
        const savedAdmin = await newAdmin.save();
        res.status(201).json(savedAdmin); // Respond with the saved admin data
    } catch (error) {
        console.error("Error creating Admin:", error);
        res.status(500).json({ message: "Error creating Admin", error: error.message });
    }
});

// Connect to MongoDB
mongoose.set('debug', true);
mongoose.connect("mongodb+srv://hextechch:mvie3YlaXa59egzs@dimitris.tufc7.mongodb.net/main_db?retryWrites=true&w=majority&appName=Dimitris")
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((error) => {
        console.error("Error connecting to DB:", error);
    });

// Export the Express app for Vercel
export default app;

// The Vercel function handler
export const handler = (req, res) => {
    app(req, res);
};
