import { Request, Response } from "express";
import { storage } from "../storage";
import { insertBookSchema } from "@shared/schema";
import { z } from "zod";

const getBooks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const sort = req.query.sort as string || 'title';
    const order = req.query.order as 'asc' | 'desc' || 'asc';
    
    const result = await storage.getBooks(page, limit, category, search, sort, order);
    
    res.status(200).json({
      books: result.books,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
};

const getBook = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const book = await storage.getBook(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    // Get reviews for the book
    const reviews = await storage.getReviewsByBook(id);
    
    // Calculate average rating
    let averageRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      averageRating = sum / reviews.length;
    }
    
    res.status(200).json({
      book,
      reviews,
      averageRating,
      reviewCount: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book" });
  }
};

const getFeaturedBooks = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 4;
    const featuredBooks = await storage.getFeaturedBooks(limit);
    
    res.status(200).json(featuredBooks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving featured books" });
  }
};

const createBook = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validatedData = insertBookSchema.parse(req.body);
    
    // Create the book
    const newBook = await storage.createBook(validatedData);
    
    res.status(201).json(newBook);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: "Error creating book" });
  }
};

export default {
  getBooks,
  getBook,
  getFeaturedBooks,
  createBook
};
