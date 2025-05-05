import express, { type Express, Router } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bookController from "./controllers/bookController";
import userController from "./controllers/userController";
import reviewController from "./controllers/reviewController";
import userBookController from "./controllers/userBookController";
import { authMiddleware } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API router
  const apiRouter = Router();
  
  // Book routes
  apiRouter.get("/books/featured", bookController.getFeaturedBooks);
  apiRouter.get("/books", bookController.getBooks);
  apiRouter.get("/books/:id", bookController.getBook);
  apiRouter.post("/books", authMiddleware, bookController.createBook);
  
  // Review routes
  apiRouter.get("/reviews", reviewController.getReviews);
  apiRouter.post("/reviews", authMiddleware, reviewController.createReview);
  apiRouter.post("/reviews/refine", authMiddleware, reviewController.refineReview);
  
  // User routes
  apiRouter.post("/auth/register", userController.register);
  apiRouter.post("/auth/login", userController.login);
  apiRouter.get("/auth/me", authMiddleware, userController.getMe);
  apiRouter.post("/auth/logout", userController.logout);
  
  // User books routes (reading lists)
  apiRouter.get("/users/books", authMiddleware, userBookController.getUserBooks);
  apiRouter.post("/users/books", authMiddleware, userBookController.addBookToList);
  apiRouter.delete("/users/books/:bookId", authMiddleware, userBookController.removeBookFromList);
  
  // These routes with path params must come after more specific routes
  apiRouter.get("/users/:id", userController.getUser);
  apiRouter.put("/users/:id", authMiddleware, userController.updateUser);
  
  // Mount API router to /api
  app.use("/api", apiRouter);
  
  // Setup session middleware
  app.use(express.json());
  
  const httpServer = createServer(app);
  
  return httpServer;
}
