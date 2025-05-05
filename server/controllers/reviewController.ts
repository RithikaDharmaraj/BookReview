import { Request, Response } from "express";
import { storage } from "../storage";
import { insertReviewSchema, reviewFormSchema } from "@shared/schema";
import { z } from "zod";
import { refineReviewWithAI } from "../services/openaiService";

const getReviews = async (req: Request, res: Response) => {
  try {
    const bookId = req.query.bookId ? parseInt(req.query.bookId as string) : undefined;
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    
    let reviews = [];
    
    if (bookId) {
      reviews = await storage.getReviewsByBook(bookId);
    } else if (userId) {
      reviews = await storage.getReviewsByUser(userId);
    } else {
      return res.status(400).json({ message: "Either bookId or userId is required" });
    }
    
    // For each review, get the user's name
    const reviewsWithUserDetails = await Promise.all(
      reviews.map(async (review) => {
        const user = await storage.getUser(review.userId);
        return {
          ...review,
          user: user ? {
            id: user.id,
            name: user.name,
            username: user.username,
            profileImage: user.profileImage
          } : undefined
        };
      })
    );
    
    res.status(200).json(reviewsWithUserDetails);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reviews" });
  }
};

const createReview = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validatedData = reviewFormSchema.parse(req.body);
    
    const { useAiRefinement, ...reviewData } = validatedData;
    
    // User should be attached to the request by authMiddleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user.id;
    
    // Check if the book exists
    const book = await storage.getBook(reviewData.bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    // Create the review
    const newReview = await storage.createReview({
      ...reviewData,
      userId: userId
    });
    
    res.status(201).json({
      ...newReview,
      user: {
        id: req.user.id,
        name: req.user.name,
        username: req.user.username,
        profileImage: req.user.profileImage
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Error creating review" });
  }
};

const refineReview = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    
    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "Review content is required" });
    }
    
    // Use OpenAI to refine the review
    const refinedContent = await refineReviewWithAI(content);
    
    res.status(200).json({ original: content, refined: refinedContent });
  } catch (error) {
    console.error("Error refining review:", error);
    res.status(500).json({ message: "Error refining review" });
  }
};

export default {
  getReviews,
  createReview,
  refineReview
};
