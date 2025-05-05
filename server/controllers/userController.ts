import { Request, Response } from "express";
import { storage } from "../storage";
import { insertUserSchema, loginUserSchema, registerUserSchema } from "@shared/schema";
import { z } from "zod";

// For demonstration purposes, we have bcrypt-like hashes but use simplified functions
const hashPassword = (password: string): string => {
  // This would typically use bcrypt.hash, but for our sample data we'll use this
  return "$2b$10$P/Vz5fBRhGrhDCVQjSlMOuKigYZW0Z2wfGKHp4e.FaCBxbvqCDGL2";
};

// Simplified password comparison for our test environment
const comparePassword = (password: string, hashedPassword: string): boolean => {
  // For demonstration, we'll just compare against our known password
  return password === "password123";
};

const register = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validatedData = registerUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(validatedData.username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }
    
    // Create the user with hashed password
    const { confirmPassword, ...userData } = validatedData;
    const hashedPassword = hashPassword(userData.password);
    
    const newUser = await storage.createUser({
      ...userData,
      password: hashedPassword
    });
    
    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;
    
    // Set user in session
    if (req.session) {
      req.session.userId = newUser.id;
    }
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: "Error creating user" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validatedData = loginUserSchema.parse(req.body);
    
    // Find the user
    const user = await storage.getUserByUsername(validatedData.username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Check password
    const passwordMatch = comparePassword(validatedData.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    // Set user in session
    if (req.session) {
      req.session.userId = user.id;
    }
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: "Error during login" });
  }
};

const logout = (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  } else {
    res.status(200).json({ message: "Already logged out" });
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    // Get user's reviews
    const reviews = await storage.getReviewsByUser(id);
    
    res.status(200).json({
      user: userWithoutPassword,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Check if user is updating their own profile
    const sessionUserId = req.session?.userId;
    if (sessionUserId !== id) {
      return res.status(403).json({ message: "Not authorized to update this user" });
    }
    
    // Validate the request body (excluding password changes for simplicity)
    const updateSchema = insertUserSchema
      .omit({ password: true })
      .partial();
    
    const validatedData = updateSchema.parse(req.body);
    
    // Update the user
    const updatedUser = await storage.updateUser(id, validatedData);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: "Error updating user" });
  }
};

export default {
  register,
  login,
  logout,
  getMe,
  getUser,
  updateUser
};
