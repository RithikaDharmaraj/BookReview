import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage as memStorage } from "./storage"; // Use in-memory storage for now

// Get the appropriate storage implementation (MongoDB or fallback)
// This will be set in index.ts when connecting to MongoDB
const getStorage = () => {
  return (global as any).storage || memStorage;
};
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertUserSchema, 
  insertBookSchema, 
  insertReviewSchema, 
  insertChallengeSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Prefix
  const API_PREFIX = "/api";
  
  // Error handler middleware
  const handleError = (err: any, res: Response) => {
    console.error(err);
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ message: validationError.message });
    }
    return res.status(500).json({ message: err.message || "Internal server error" });
  };

  // User Routes
  app.post(`${API_PREFIX}/register`, async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUserByUsername = await getStorage().getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingUserByEmail = await getStorage().getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const user = await getStorage().createUser(userData);
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post(`${API_PREFIX}/login`, async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await getStorage().getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get(`${API_PREFIX}/users/:id`, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await getStorage().getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.put(`${API_PREFIX}/users/:id`, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await getStorage().getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only allow updating certain fields
      const allowedUpdates = ["fullName", "bio", "avatar"];
      const userData: any = {};
      
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          userData[field] = req.body[field];
        }
      });
      
      if (Object.keys(userData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      
      const updatedUser = await getStorage().updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Book Routes
  app.get(`${API_PREFIX}/books`, async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchTerm = req.query.search as string;
      const genre = req.query.genre as string;
      
      const { books, total } = await getStorage().getBooks(page, limit, searchTerm, genre);
      
      res.json({
        books,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get(`${API_PREFIX}/books/featured`, async (req: Request, res: Response) => {
    try {
      const featuredBooks = await getStorage().getFeaturedBooks();
      res.json(featuredBooks);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get(`${API_PREFIX}/books/genre/:genre`, async (req: Request, res: Response) => {
    try {
      const genre = req.params.genre;
      const limit = parseInt(req.query.limit as string) || 6;
      
      if (!genre) {
        return res.status(400).json({ message: "Genre is required" });
      }
      
      const books = await getStorage().getBooksByGenre(genre, limit);
      res.json(books);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get(`${API_PREFIX}/books/:id`, async (req: Request, res: Response) => {
    try {
      const bookId = parseInt(req.params.id);
      
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
      
      const book = await getStorage().getBook(bookId);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post(`${API_PREFIX}/books`, async (req: Request, res: Response) => {
    try {
      // Check if user is admin
      const userData = req.body.user;
      if (!userData || !userData.isAdmin) {
        return res.status(403).json({ message: "Only admins can add books" });
      }
      
      const bookData = insertBookSchema.parse(req.body.book);
      const book = await getStorage().createBook(bookData);
      res.status(201).json(book);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Review Routes
  app.get(`${API_PREFIX}/reviews`, async (req: Request, res: Response) => {
    try {
      const bookId = parseInt(req.query.bookId as string);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Valid bookId query parameter is required" });
      }
      
      const { reviews, total } = await getStorage().getReviews(bookId, page, limit);
      
      // Get user info for each review
      const reviewsWithUserInfo = await Promise.all(reviews.map(async (review) => {
        const user = await getStorage().getUser(review.userId);
        return {
          ...review,
          user: user ? {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar
          } : null
        };
      }));
      
      res.json({
        reviews: reviewsWithUserInfo,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get(`${API_PREFIX}/reviews/user/:userId`, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const reviews = await getStorage().getUserReviews(userId);
      
      // Get book info for each review
      const reviewsWithBookInfo = await Promise.all(reviews.map(async (review) => {
        const book = await getStorage().getBook(review.bookId);
        return {
          ...review,
          book: book ? {
            id: book.id,
            title: book.title,
            author: book.author,
            coverImage: book.coverImage
          } : null
        };
      }));
      
      res.json(reviewsWithBookInfo);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post(`${API_PREFIX}/reviews`, async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Validate book exists
      const book = await getStorage().getBook(reviewData.bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      // Validate user exists
      const user = await getStorage().getUser(reviewData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Validate rating is between 1 and 5
      if (reviewData.rating < 1 || reviewData.rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      
      const review = await getStorage().createReview(reviewData);
      
      // Return review with user info
      const reviewWithUserInfo = {
        ...review,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar
        }
      };
      
      res.status(201).json(reviewWithUserInfo);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Reading Challenge Routes
  app.get(`${API_PREFIX}/challenges/:userId/:year`, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const year = parseInt(req.params.year);
      
      if (isNaN(userId) || isNaN(year)) {
        return res.status(400).json({ message: "Invalid user ID or year" });
      }
      
      const challenge = await getStorage().getChallenge(userId, year);
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(challenge);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post(`${API_PREFIX}/challenges`, async (req: Request, res: Response) => {
    try {
      const challengeData = insertChallengeSchema.parse(req.body);
      
      // Validate user exists
      const user = await getStorage().getUser(challengeData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if challenge for this user and year already exists
      const existingChallenge = await getStorage().getChallenge(challengeData.userId, challengeData.year);
      if (existingChallenge) {
        return res.status(400).json({ message: "Challenge already exists for this user and year" });
      }
      
      const challenge = await getStorage().createChallenge(challengeData);
      res.status(201).json(challenge);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Optional: AI-powered review refinement
  app.post(`${API_PREFIX}/reviews/refine`, async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "Review content is required" });
      }
      
      // Since we don't have actual OpenAI API integration, we'll simulate a refined version
      // In a real implementation, this would call the OpenAI API
      const refinedContent = simulateAIRefinement(content);
      
      res.json({ original: content, refined: refinedContent });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Reading List Routes
  app.get(`${API_PREFIX}/reading-list/:userId`, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const status = req.query.status as string;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const readingList = await getStorage().getUserReadingList(userId, status);
      res.json(readingList);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post(`${API_PREFIX}/reading-list`, async (req: Request, res: Response) => {
    try {
      const { userId, bookId, status } = req.body;
      
      if (!userId || !bookId || !status) {
        return res.status(400).json({ message: "userId, bookId and status are required" });
      }
      
      // Validate user exists
      const user = await getStorage().getUser(parseInt(userId));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Validate book exists
      const book = await getStorage().getBook(parseInt(bookId));
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      const readingListItem = await getStorage().addToReadingList(
        parseInt(userId), 
        parseInt(bookId), 
        status
      );
      
      res.status(201).json(readingListItem);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.delete(`${API_PREFIX}/reading-list/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reading list ID" });
      }
      
      const success = await getStorage().removeFromReadingList(id);
      
      if (!success) {
        return res.status(404).json({ message: "Reading list item not found" });
      }
      
      res.sendStatus(204); // No content, successful deletion
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.patch(`${API_PREFIX}/reading-list/:id/status`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reading list ID" });
      }
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedItem = await getStorage().updateReadingListStatus(id, status);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Reading list item not found" });
      }
      
      res.json(updatedItem);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to simulate AI refinement
function simulateAIRefinement(content: string): string {
  // This is a simple function to simulate AI refinement
  // It makes the text more formal and fixes common grammar issues
  
  let refined = content;
  
  // Replace contractions
  refined = refined.replace(/don't/g, "do not");
  refined = refined.replace(/can't/g, "cannot");
  refined = refined.replace(/won't/g, "will not");
  refined = refined.replace(/I'm/g, "I am");
  refined = refined.replace(/you're/g, "you are");
  refined = refined.replace(/they're/g, "they are");
  
  // Capitalize first letter of sentences
  refined = refined.replace(/\. [a-z]/g, (match) => {
    return match.toUpperCase();
  });
  
  // Add more sophisticated language
  refined = refined.replace(/good/g, "excellent");
  refined = refined.replace(/bad/g, "disappointing");
  refined = refined.replace(/nice/g, "delightful");
  refined = refined.replace(/liked/g, "appreciated");
  refined = refined.replace(/didn't like/g, "did not appreciate");
  
  // Add a thoughtful conclusion if it's long enough
  if (refined.length > 100) {
    refined += " In conclusion, this book offers a unique perspective that readers will find both engaging and thought-provoking.";
  }
  
  return refined;
}
