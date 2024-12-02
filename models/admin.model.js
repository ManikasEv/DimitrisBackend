import bcrypt from 'bcrypt';
import mongoose from "mongoose";
const AdminSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"]
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "Please enter a valid email address"]
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        address: {
            type: String,
            required: [true, "Address is required"]
        },
        telephone: {
            type: String,
            required: [true, "Telephone number is required"]
        }
    },
    { timestamps: true }
);

// Hash password before saving to DB
AdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // If the password is not modified, skip hashing.
    this.password = await bcrypt.hash(this.password, 10); // Hash the password with salt rounds of 10
    next();
});

// Export the model
const Admin = mongoose.model('Admin', AdminSchema, 'Admin'); // Explicitly specify collection name 'Admin'
export default Admin;
