import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const usersController = {

  getAll: async (req, res) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (err) {
      res.status(500).send({ error: "Failed to retrieve users", details: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const userById = await User.findById(id);
      if (userById) res.send(userById);
      else res.status(404).send({ error: "user not found" });
    } catch (err) {
      res.status(400).send({ error: "Invalid ID", details: err.message });
    }
  },

  post: async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      if (!password) {
        return res.status(400).send({ error: "Password is required" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      const savedUser = await newUser.save();
      res.status(201).send(savedUser);
    } catch (err) {
      res.status(400).send({ error: "Invalid body", details: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).send({ error: "Invalid email or password" });
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).send({ error: "Invalid email or password" });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      const { _id, name } = user;
      res.send({ token, user: { _id, name, email } });
    } catch (err) {
      res.status(500).send({ error: "Login failed", details: err.message });
    }
  },

  put: async (req, res) => {
    try {
      const lid = req.params.id;
      const updateduser = await User.findByIdAndUpdate(lid, req.body, {
        new: true,
        runValidators: true,
      });
      if (updateduser) res.status(200).send(updateduser);
      else res.status(404).send({ error: "user not found" });
    } catch (err) {
      res.status(400).send({ error: "Invalid ID or data", details: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const userId = req.params.id;
      const deleteduser = await User.findByIdAndDelete(userId);
      if (deleteduser) res.status(200).send({ message: "user deleted successfully", user: deleteduser });
      else res.status(404).send({ error: "user not found" });
    } catch (err) {
      res.status(400).send({ error: "Invalid ID", details: err.message });
    }
  }
};

export default usersController;
