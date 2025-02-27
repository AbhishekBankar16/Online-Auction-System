import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Product from "../models/product.js";
import mongoose from "mongoose";

dotenv.config(); // ✅ Fixed dotenv issue

const handleSignup = async (req, res) => {
    console.log("Signup request received:", req.body);

    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ error: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, name: newUser.name, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '14d' }
        );

        return res.status(201).json({ token });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

const handleLogin = async (req, res) => {
    console.log("Login request received:", req.body);

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User doesn't exist." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '14d' }
        );

        return res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

const handleDelete = async (req, res) => {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User doesn't exist." });
        }

        await Product.deleteMany({ seller: userId });
        await User.findByIdAndDelete(userId);

        return res.status(200).json({ message: "User and all related posts deleted successfully" });
    } catch (err) {
        console.error("Delete user error:", err);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

const handleGetUser = async (req, res) => {
    const { seller } = req.body;

    if (!mongoose.Types.ObjectId.isValid(seller)) {
        return res.status(400).json({ error: "Invalid seller ID format" });
    }

    try {
        const user = await User.findById(seller).select("name");
        if (!user) {
            return res.status(404).json({ error: "Seller not found." });
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error("Get user error:", err);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

const handleUser = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User doesn't exist." });
        }

        const products = await Product.find({ seller: userId })
            .sort({ createdAt: -1 })
            .populate('seller', '_id name');

        return res.status(200).json({
            message: products.length > 0 ? "User and Products" : "No products found.",
            user,
            products,
        });
    } catch (err) {
        console.error("Get user products error:", err);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

export { handleSignup, handleLogin, handleDelete, handleGetUser, handleUser };