import { 
  users, type User, type InsertUser,
  books, type Book, type InsertBook,
  reviews, type Review, type InsertReview,
  readingChallenges, type ReadingChallenge, type InsertChallenge,
  readingLists, type ReadingList, type InsertReadingList
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, desc, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Book operations
  getBooks(page: number, limit: number, searchTerm?: string, genre?: string): Promise<{books: Book[], total: number}>;
  getBook(id: number): Promise<Book | undefined>;
  getFeaturedBooks(): Promise<Book[]>;
  getBooksByGenre(genre: string, limit: number): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, bookData: Partial<InsertBook>): Promise<Book | undefined>;
  
  // Review operations
  getReviews(bookId: number, page: number, limit: number): Promise<{reviews: Review[], total: number}>;
  getUserReviews(userId: number): Promise<Review[]>;
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, reviewData: Partial<InsertReview>): Promise<Review | undefined>;
  
  // Reading Challenge operations
  getChallenge(userId: number, year: number): Promise<ReadingChallenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<ReadingChallenge>;
  updateChallenge(id: number, challengeData: Partial<InsertChallenge>): Promise<ReadingChallenge | undefined>;
  
  // Reading List operations
  getUserReadingList(userId: number, status?: string): Promise<ReadingList[]>;
  addToReadingList(userId: number, bookId: number, status: string): Promise<ReadingList>;
  removeFromReadingList(id: number): Promise<boolean>;
  updateReadingListStatus(id: number, status: string): Promise<ReadingList | undefined>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

// Import memory store
import createMemoryStore from "memorystore";
const MemoryStore = createMemoryStore(session);

// Use PostgreSQL for session storage
const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
    
    // Initial seed if needed
    this.initializeDatabase();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Book operations
  async getBooks(page: number = 1, limit: number = 10, searchTerm?: string, genre?: string): Promise<{books: Book[], total: number}> {
    let query = db.select().from(books);
    
    if (searchTerm) {
      query = query.where(
        sql`${books.title} ILIKE ${`%${searchTerm}%`} OR ${books.author} ILIKE ${`%${searchTerm}%`} OR ${books.description} ILIKE ${`%${searchTerm}%`}`
      );
    }
    
    if (genre) {
      // Search for genre in the array
      query = query.where(
        sql`${books.genres}::text[] @> ARRAY[${genre}]::text[]`
      );
    }
    
    // Count total results
    const totalCountResult = await db.select({ count: sql<number>`count(*)` }).from(query.as('subquery'));
    const total = totalCountResult[0]?.count || 0;
    
    // Get paginated results
    const offset = (page - 1) * limit;
    const booksResults = await query.limit(limit).offset(offset);
    
    return { books: booksResults, total };
  }
  
  async getBook(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }
  
  async getFeaturedBooks(): Promise<Book[]> {
    return db.select().from(books).where(eq(books.featured, true));
  }
  
  async getBooksByGenre(genre: string, limit: number = 6): Promise<Book[]> {
    return db.select()
      .from(books)
      .where(sql`${books.genres}::text[] @> ARRAY[${genre}]::text[]`)
      .limit(limit);
  }
  
  async createBook(insertBook: InsertBook): Promise<Book> {
    const [book] = await db.insert(books).values(insertBook).returning();
    return book;
  }
  
  async updateBook(id: number, bookData: Partial<InsertBook>): Promise<Book | undefined> {
    const [updatedBook] = await db
      .update(books)
      .set(bookData)
      .where(eq(books.id, id))
      .returning();
    return updatedBook;
  }
  
  // Review operations
  async getReviews(bookId: number, page: number = 1, limit: number = 10): Promise<{reviews: Review[], total: number}> {
    // Get reviews with user information
    const offset = (page - 1) * limit;
    
    const reviewsWithUsers = await db.select({
      review: reviews,
      user: {
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        avatar: users.avatar
      },
      book: {
        id: books.id,
        title: books.title,
        author: books.author,
        coverImage: books.coverImage
      }
    })
    .from(reviews)
    .where(eq(reviews.bookId, bookId))
    .innerJoin(users, eq(reviews.userId, users.id))
    .innerJoin(books, eq(reviews.bookId, books.id))
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset);
    
    // Count total reviews for the book
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.bookId, bookId));
    
    const total = countResult?.count || 0;
    
    // Transform results to match Review type with user and book info
    const formattedReviews = reviewsWithUsers.map(item => ({
      ...item.review,
      user: item.user,
      book: item.book
    }));
    
    return { reviews: formattedReviews, total };
  }
  
  async getUserReviews(userId: number): Promise<Review[]> {
    // Get all reviews for a user with book information
    const userReviews = await db.select({
      review: reviews,
      book: {
        id: books.id,
        title: books.title,
        author: books.author,
        coverImage: books.coverImage
      }
    })
    .from(reviews)
    .where(eq(reviews.userId, userId))
    .innerJoin(books, eq(reviews.bookId, books.id))
    .orderBy(desc(reviews.createdAt));
    
    // Transform results to match Review type with book info
    return userReviews.map(item => ({
      ...item.review,
      book: item.book
    }));
  }
  
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }
  
  async updateReview(id: number, reviewData: Partial<InsertReview>): Promise<Review | undefined> {
    const [updatedReview] = await db
      .update(reviews)
      .set(reviewData)
      .where(eq(reviews.id, id))
      .returning();
    return updatedReview;
  }
  
  // Reading Challenge operations
  async getChallenge(userId: number, year: number): Promise<ReadingChallenge | undefined> {
    const [challenge] = await db
      .select()
      .from(readingChallenges)
      .where(and(
        eq(readingChallenges.userId, userId),
        eq(readingChallenges.year, year)
      ));
    return challenge;
  }
  
  async createChallenge(insertChallenge: InsertChallenge): Promise<ReadingChallenge> {
    const [challenge] = await db
      .insert(readingChallenges)
      .values(insertChallenge)
      .returning();
    return challenge;
  }
  
  async updateChallenge(id: number, challengeData: Partial<InsertChallenge>): Promise<ReadingChallenge | undefined> {
    const [updatedChallenge] = await db
      .update(readingChallenges)
      .set(challengeData)
      .where(eq(readingChallenges.id, id))
      .returning();
    return updatedChallenge;
  }
  
  // Reading List operations
  async getUserReadingList(userId: number, status?: string): Promise<ReadingList[]> {
    let query = db.select({
      readingList: readingLists,
      book: {
        id: books.id,
        title: books.title,
        author: books.author,
        coverImage: books.coverImage
      }
    })
    .from(readingLists)
    .where(eq(readingLists.userId, userId))
    .innerJoin(books, eq(readingLists.bookId, books.id))
    .orderBy(desc(readingLists.addedAt));
    
    if (status) {
      query = query.where(eq(readingLists.status, status));
    }
    
    const results = await query;
    
    // Transform results to include book info
    return results.map(item => ({
      ...item.readingList,
      book: item.book
    }));
  }

  async addToReadingList(userId: number, bookId: number, status: string): Promise<ReadingList> {
    // Check if already in reading list
    const existing = await db.select()
      .from(readingLists)
      .where(and(
        eq(readingLists.userId, userId),
        eq(readingLists.bookId, bookId)
      ));
    
    if (existing.length > 0) {
      // Update existing entry
      const [updated] = await db.update(readingLists)
        .set({ status })
        .where(eq(readingLists.id, existing[0].id))
        .returning();
      
      return updated;
    }
    
    // Create new entry
    const [entry] = await db.insert(readingLists)
      .values({
        userId,
        bookId,
        status
      } as InsertReadingList)
      .returning();
    
    return entry;
  }

  async removeFromReadingList(id: number): Promise<boolean> {
    const result = await db.delete(readingLists)
      .where(eq(readingLists.id, id))
      .returning();
    
    return result.length > 0;
  }

  async updateReadingListStatus(id: number, status: string): Promise<ReadingList | undefined> {
    const [updated] = await db.update(readingLists)
      .set({ status })
      .where(eq(readingLists.id, id))
      .returning();
    
    return updated;
  }
  
  // Initialize database with sample data if needed
  private async initializeDatabase() {
    // Check if we have any users
    const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
    
    if (userCount[0]?.count === 0) {
      // Create admin user
      await this.createUser({
        username: "admin",
        password: "admin123", // In production, this should be hashed
        email: "admin@bookwise.com",
        fullName: "Admin User",
        bio: "Platform administrator",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        isAdmin: true
      } as InsertUser);
      
      // Add sample books
      const sampleBooks: InsertBook[] = [
        {
          title: "The Silent Patient",
          author: "Alex Michaelides",
          description: "A shocking psychological thriller of a woman's act of violence against her husband—and of the therapist obsessed with uncovering her motive.",
          coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          price: 16.99,
          isbn: "9781250301697",
          publishedDate: new Date("2019-02-05"),
          publisher: "Celadon Books",
          genres: ["Mystery", "Thriller", "Psychological Fiction"],
          pages: 336,
          language: "English",
          featured: true
        },
        {
          title: "Where the Crawdads Sing",
          author: "Delia Owens",
          description: "A painfully beautiful first novel that is at once a murder mystery, a coming-of-age narrative, and a celebration of nature.",
          coverImage: "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          price: 14.99,
          isbn: "9780735219090",
          publishedDate: new Date("2018-08-14"),
          publisher: "G.P. Putnam's Sons",
          genres: ["Fiction", "Literary Fiction", "Mystery"],
          pages: 379,
          language: "English",
          featured: true
        },
        {
          title: "Atomic Habits",
          author: "James Clear",
          description: "An easy and proven way to build good habits and break bad ones with practical strategies for transforming habits.",
          coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          price: 18.99,
          isbn: "9780735211292",
          publishedDate: new Date("2018-10-16"),
          publisher: "Avery",
          genres: ["Self Help", "Nonfiction", "Psychology"],
          pages: 320,
          language: "English",
          featured: true
        }
      ];
      
      for (const book of sampleBooks) {
        await this.createBook(book);
      }
      
      // Add sample reviews
      await this.createReview({
        userId: 1,
        bookId: 1,
        content: "This psychological thriller kept me on the edge of my seat! The twist at the end completely caught me off guard. I couldn't put it down and finished it in one sitting. Highly recommend to anyone who enjoys a good mystery.",
        rating: 4
      });
    }
  }
}

// Create a new class with in-memory storage
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private reviews: Map<number, Review>;
  private challenges: Map<number, ReadingChallenge>;
  private readingLists: Map<number, ReadingList>;
  
  private userCurrentId: number;
  private bookCurrentId: number;
  private reviewCurrentId: number;
  private challengeCurrentId: number;
  private readingListCurrentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.reviews = new Map();
    this.challenges = new Map();
    this.readingLists = new Map();
    
    this.userCurrentId = 1;
    this.bookCurrentId = 1;
    this.reviewCurrentId = 1;
    this.challengeCurrentId = 1;
    this.readingListCurrentId = 1;
    
    // Use in-memory session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Seed initial admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@bookwise.com",
      fullName: "Admin User",
      bio: "Platform administrator",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      isAdmin: true
    } as InsertUser);
    
    // Seed sample books
    this.seedBooks();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Book operations
  async getBooks(page: number = 1, limit: number = 10, searchTerm?: string, genre?: string): Promise<{books: Book[], total: number}> {
    let filteredBooks = Array.from(this.books.values());
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(search) || 
        book.author.toLowerCase().includes(search) ||
        book.description.toLowerCase().includes(search)
      );
    }
    
    if (genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genres && book.genres.some(g => g.toLowerCase() === genre.toLowerCase())
      );
    }
    
    const total = filteredBooks.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
    
    return { books: paginatedBooks, total };
  }
  
  async getBook(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }
  
  async getFeaturedBooks(): Promise<Book[]> {
    return Array.from(this.books.values()).filter(book => book.featured);
  }
  
  async getBooksByGenre(genre: string, limit: number = 6): Promise<Book[]> {
    return Array.from(this.books.values())
      .filter(book => book.genres && book.genres.some(g => g.toLowerCase() === genre.toLowerCase()))
      .slice(0, limit);
  }
  
  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.bookCurrentId++;
    const book: Book = { ...insertBook, id };
    this.books.set(id, book);
    return book;
  }
  
  async updateBook(id: number, bookData: Partial<InsertBook>): Promise<Book | undefined> {
    const book = await this.getBook(id);
    if (!book) return undefined;
    
    const updatedBook = { ...book, ...bookData };
    this.books.set(id, updatedBook);
    return updatedBook;
  }
  
  // Review operations
  async getReviews(bookId: number, page: number = 1, limit: number = 10): Promise<{reviews: Review[], total: number}> {
    const bookReviews = Array.from(this.reviews.values())
      .filter(review => review.bookId === bookId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const total = bookReviews.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedReviews = bookReviews.slice(startIndex, endIndex);
    
    // Add user and book info to each review
    const reviewsWithInfo = paginatedReviews.map(review => {
      const user = this.users.get(review.userId);
      const book = this.books.get(review.bookId);
      
      return {
        ...review,
        user: user ? {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar
        } : undefined,
        book: book ? {
          id: book.id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage
        } : undefined
      };
    });
    
    return { reviews: reviewsWithInfo, total };
  }
  
  async getUserReviews(userId: number): Promise<Review[]> {
    const userReviews = Array.from(this.reviews.values())
      .filter(review => review.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Add book info to each review
    return userReviews.map(review => {
      const book = this.books.get(review.bookId);
      
      return {
        ...review,
        book: book ? {
          id: book.id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage
        } : undefined
      };
    });
  }
  
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewCurrentId++;
    const review: Review = { 
      ...insertReview, 
      id, 
      likesCount: 0,
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }
  
  async updateReview(id: number, reviewData: Partial<InsertReview>): Promise<Review | undefined> {
    const review = await this.getReview(id);
    if (!review) return undefined;
    
    const updatedReview = { ...review, ...reviewData };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }
  
  // Reading Challenge operations
  async getChallenge(userId: number, year: number): Promise<ReadingChallenge | undefined> {
    return Array.from(this.challenges.values()).find(
      challenge => challenge.userId === userId && challenge.year === year
    );
  }
  
  async createChallenge(insertChallenge: InsertChallenge): Promise<ReadingChallenge> {
    const id = this.challengeCurrentId++;
    const challenge: ReadingChallenge = { 
      ...insertChallenge, 
      id,
      completedBooks: 0
    };
    this.challenges.set(id, challenge);
    return challenge;
  }
  
  async updateChallenge(id: number, challengeData: Partial<InsertChallenge>): Promise<ReadingChallenge | undefined> {
    const challenge = this.challenges.get(id);
    if (!challenge) return undefined;
    
    const updatedChallenge = { ...challenge, ...challengeData };
    this.challenges.set(id, updatedChallenge);
    return updatedChallenge;
  }
  
  // Reading List operations
  async getUserReadingList(userId: number, status?: string): Promise<ReadingList[]> {
    let readingListItems = Array.from(this.readingLists.values())
      .filter(item => item.userId === userId)
      .sort((a, b) => {
        if (a.addedAt && b.addedAt) {
          return b.addedAt.getTime() - a.addedAt.getTime();
        }
        return 0;
      });
    
    if (status) {
      readingListItems = readingListItems.filter(item => item.status === status);
    }
    
    // Add book info to each reading list item
    return readingListItems.map(item => {
      const book = this.books.get(item.bookId);
      
      return {
        ...item,
        book: book ? {
          id: book.id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage
        } : undefined
      };
    });
  }

  async addToReadingList(userId: number, bookId: number, status: string): Promise<ReadingList> {
    // Check if already in reading list
    const existing = Array.from(this.readingLists.values()).find(
      item => item.userId === userId && item.bookId === bookId
    );
    
    if (existing) {
      // Update existing entry
      const updatedItem = { ...existing, status };
      this.readingLists.set(existing.id, updatedItem);
      
      const book = this.books.get(bookId);
      return {
        ...updatedItem,
        book: book ? {
          id: book.id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage
        } : undefined
      };
    }
    
    // Create new entry
    const id = this.readingListCurrentId++;
    const newItem: ReadingList = {
      id,
      userId,
      bookId,
      status,
      addedAt: new Date()
    };
    
    this.readingLists.set(id, newItem);
    
    const book = this.books.get(bookId);
    return {
      ...newItem,
      book: book ? {
        id: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage
      } : undefined
    };
  }

  async removeFromReadingList(id: number): Promise<boolean> {
    if (!this.readingLists.has(id)) {
      return false;
    }
    
    this.readingLists.delete(id);
    return true;
  }

  async updateReadingListStatus(id: number, status: string): Promise<ReadingList | undefined> {
    const item = this.readingLists.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, status };
    this.readingLists.set(id, updatedItem);
    
    const book = this.books.get(item.bookId);
    return {
      ...updatedItem,
      book: book ? {
        id: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage
      } : undefined
    };
  }
  
  // Helper method to seed sample books
  private seedBooks() {
    const sampleBooks: InsertBook[] = [
      {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        description: "A shocking psychological thriller of a woman's act of violence against her husband—and of the therapist obsessed with uncovering her motive.",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: 16.99,
        isbn: "9781250301697",
        publishedDate: new Date("2019-02-05"),
        publisher: "Celadon Books",
        genres: ["Mystery", "Thriller", "Psychological Fiction"],
        pages: 336,
        language: "English",
        featured: true
      },
      {
        title: "Where the Crawdads Sing",
        author: "Delia Owens",
        description: "A painfully beautiful first novel that is at once a murder mystery, a coming-of-age narrative, and a celebration of nature.",
        coverImage: "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: 14.99,
        isbn: "9780735219090",
        publishedDate: new Date("2018-08-14"),
        publisher: "G.P. Putnam's Sons",
        genres: ["Fiction", "Literary Fiction", "Mystery"],
        pages: 379,
        language: "English",
        featured: true
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        description: "An easy and proven way to build good habits and break bad ones with practical strategies for transforming habits.",
        coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: 18.99,
        isbn: "9780735211292",
        publishedDate: new Date("2018-10-16"),
        publisher: "Avery",
        genres: ["Self Help", "Nonfiction", "Psychology"],
        pages: 320,
        language: "English",
        featured: true
      },
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        description: "Between life and death there is a library, and within that library, the shelves go on forever.",
        coverImage: "https://images.unsplash.com/photo-1603162618435-c71f261db4de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: 15.99,
        isbn: "9780525559474",
        publishedDate: new Date("2020-09-29"),
        publisher: "Viking",
        genres: ["Fiction", "Fantasy", "Contemporary"],
        pages: 304,
        language: "English",
        featured: true
      },
      {
        title: "The Invisible Life of Addie LaRue",
        author: "V.E. Schwab",
        description: "A life no one will remember. A story you will never forget. France, 1714: in a moment of desperation, a young woman makes a Faustian bargain to live forever—and is cursed to be forgotten by everyone she meets.",
        coverImage: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: 17.99,
        isbn: "9780765387561",
        publishedDate: new Date("2020-10-06"),
        publisher: "Tor Books",
        genres: ["Fantasy", "Historical Fiction", "Romance"],
        pages: 448,
        language: "English",
        featured: true
      },
      {
        title: "Tomorrow, and Tomorrow, and Tomorrow",
        author: "Gabrielle Zevin",
        description: "A modern love story about two childhood friends that spans thirty years, from 1990s-era Boston to Venice Beach, California.",
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: 18.99,
        isbn: "9780593321201",
        publishedDate: new Date("2022-07-05"),
        publisher: "Knopf",
        genres: ["Fiction", "Contemporary"],
        pages: 416,
        language: "English",
        featured: false
      },
      {
        title: "Educated",
        author: "Tara Westover",
        description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
        coverImage: "https://images.unsplash.com/photo-1587876931567-564ce588bfbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: 16.99,
        isbn: "9780399590504",
        publishedDate: new Date("2018-02-20"),
        publisher: "Random House",
        genres: ["Nonfiction", "Memoir", "Biography"],
        pages: 334,
        language: "English",
        featured: false
      }
    ];
    
    sampleBooks.forEach(book => this.createBook(book));
    
    // Add some sample reviews
    this.createReview({
      userId: 1,
      bookId: 1,
      content: "This psychological thriller kept me on the edge of my seat! The twist at the end completely caught me off guard. I couldn't put it down and finished it in one sitting. Highly recommend to anyone who enjoys a good mystery.",
      rating: 4
    });
    
    this.createReview({
      userId: 1,
      bookId: 3,
      content: "A practical guide to building good habits and breaking bad ones. Clear provides actionable advice that you can implement immediately. I've started using the 2-minute rule and it's already making a difference in my productivity.",
      rating: 3.5
    });
  }
}

// Use MemStorage instead of DatabaseStorage for local development
export const storage = new MemStorage();
