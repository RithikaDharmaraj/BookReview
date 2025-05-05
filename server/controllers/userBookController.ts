import { Request, Response } from 'express';
import { storage } from '../storage';
import { z } from 'zod';

// Schema for adding a book to a user's list
const addBookSchema = z.object({
  bookId: z.number(),
  status: z.enum(['reading', 'want-to-read', 'completed'])
});

// Get user's reading lists (books categorized by status)
const getUserBooks = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userBooks = await storage.getUserBooks(userId);
    return res.status(200).json(userBooks);
  } catch (error) {
    console.error('Error getting user books:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a book to user's reading list with a specific status
const addBookToList = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const validation = addBookSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Invalid request', 
        errors: validation.error.errors 
      });
    }

    const { bookId, status } = validation.data;
    
    await storage.addBookToUserList(userId, bookId, status);
    
    return res.status(200).json({ 
      message: 'Book added to list successfully',
      status
    });
  } catch (error) {
    console.error('Error adding book to list:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove book from user's reading list
const removeBookFromList = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const bookId = Number(req.params.bookId);
    if (isNaN(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    await storage.removeBookFromUserList(userId, bookId);
    
    return res.status(200).json({ 
      message: 'Book removed from list successfully' 
    });
  } catch (error) {
    console.error('Error removing book from list:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  getUserBooks,
  addBookToList,
  removeBookFromList
};
