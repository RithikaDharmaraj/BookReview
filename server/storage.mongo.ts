import { ObjectId } from 'mongodb';
import { User, Book, Review, ReadingChallenge, ReadingList, IUser, IBook, IReview, IReadingChallenge, IReadingList } from './models';
import { db, client } from './mongodb';
import session from 'express-session';
import memoryStore from 'memorystore';

const MemoryStore = memoryStore(session);

// Convert database models to frontend types
type SimpleUser = {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  isAdmin: boolean;
};

type SimpleBook = {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  price?: number;
  isbn?: string;
  publishedDate?: Date;
  publisher?: string;
  genres?: string[];
  pages?: number;
  language?: string;
  featured?: boolean;
};

type SimpleReview = {
  id: string;
  userId: string;
  bookId: string;
  content: string;
  rating: number;
  aiEnhanced?: string;
  likesCount: number;
  createdAt: Date;
  user?: {
    id: string;
    username: string;
    fullName?: string;
    avatar?: string;
  };
  book?: {
    id: string;
    title: string;
    author: string;
    coverImage?: string;
  };
};

type SimpleReadingChallenge = {
  id: string;
  userId: string;
  targetBooks: number;
  completedBooks: number;
  year: number;
};

type SimpleReadingList = {
  id: string;
  userId: string;
  bookId: string;
  addedAt: Date;
  status: string;
  book?: {
    id: string;
    title: string;
    author: string;
    coverImage?: string;
  };
};

// Conversion helper functions
function userToSimpleUser(user: IUser): SimpleUser {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    bio: user.bio,
    avatar: user.avatar,
    isAdmin: user.isAdmin
  };
}

function bookToSimpleBook(book: IBook): SimpleBook {
  return {
    id: book._id.toString(),
    title: book.title,
    author: book.author,
    description: book.description,
    coverImage: book.coverImage,
    price: book.price,
    isbn: book.isbn,
    publishedDate: book.publishedDate,
    publisher: book.publisher,
    genres: book.genres,
    pages: book.pages,
    language: book.language,
    featured: book.featured
  };
}

function reviewToSimpleReview(review: IReview, user?: IUser, book?: IBook): SimpleReview {
  const simpleReview: SimpleReview = {
    id: review._id.toString(),
    userId: review.userId.toString(),
    bookId: review.bookId.toString(),
    content: review.content,
    rating: review.rating,
    aiEnhanced: review.aiEnhanced,
    likesCount: review.likesCount,
    createdAt: review.createdAt
  };

  if (user) {
    simpleReview.user = {
      id: user._id.toString(),
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar
    };
  }

  if (book) {
    simpleReview.book = {
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      coverImage: book.coverImage
    };
  }

  return simpleReview;
}

function challengeToSimpleChallenge(challenge: IReadingChallenge): SimpleReadingChallenge {
  return {
    id: challenge._id.toString(),
    userId: challenge.userId.toString(),
    targetBooks: challenge.targetBooks,
    completedBooks: challenge.completedBooks,
    year: challenge.year
  };
}

function readingListToSimple(item: IReadingList, book?: IBook): SimpleReadingList {
  const result: SimpleReadingList = {
    id: item._id.toString(),
    userId: item.userId.toString(),
    bookId: item.bookId.toString(),
    addedAt: item.addedAt,
    status: item.status
  };

  if (book) {
    result.book = {
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      coverImage: book.coverImage
    };
  }

  return result;
}

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: string): Promise<SimpleUser | undefined>;
  getUserByUsername(username: string): Promise<SimpleUser | undefined>;
  getUserByEmail(email: string): Promise<SimpleUser | undefined>;
  createUser(user: Omit<SimpleUser, 'id'>): Promise<SimpleUser>;
  updateUser(id: string, userData: Partial<Omit<SimpleUser, 'id'>>): Promise<SimpleUser | undefined>;
  
  // Book operations
  getBooks(page: number, limit: number, searchTerm?: string, genre?: string): Promise<{books: SimpleBook[], total: number}>;
  getBook(id: string): Promise<SimpleBook | undefined>;
  getFeaturedBooks(): Promise<SimpleBook[]>;
  getBooksByGenre(genre: string, limit: number): Promise<SimpleBook[]>;
  createBook(book: Omit<SimpleBook, 'id'>): Promise<SimpleBook>;
  updateBook(id: string, bookData: Partial<Omit<SimpleBook, 'id'>>): Promise<SimpleBook | undefined>;
  
  // Review operations
  getReviews(bookId: string, page: number, limit: number): Promise<{reviews: SimpleReview[], total: number}>;
  getUserReviews(userId: string): Promise<SimpleReview[]>;
  getReview(id: string): Promise<SimpleReview | undefined>;
  createReview(review: Omit<SimpleReview, 'id' | 'createdAt' | 'user' | 'book'>): Promise<SimpleReview>;
  updateReview(id: string, reviewData: Partial<Omit<SimpleReview, 'id' | 'user' | 'book'>>): Promise<SimpleReview | undefined>;
  
  // Reading Challenge operations
  getChallenge(userId: string, year: number): Promise<SimpleReadingChallenge | undefined>;
  createChallenge(challenge: Omit<SimpleReadingChallenge, 'id'>): Promise<SimpleReadingChallenge>;
  updateChallenge(id: string, challengeData: Partial<Omit<SimpleReadingChallenge, 'id'>>): Promise<SimpleReadingChallenge | undefined>;
  
  // Reading List operations
  getUserReadingList(userId: string, status?: string): Promise<SimpleReadingList[]>;
  addToReadingList(userId: string, bookId: string, status: string): Promise<SimpleReadingList>;
  removeFromReadingList(id: string): Promise<boolean>;
  updateReadingListStatus(id: string, status: string): Promise<SimpleReadingList | undefined>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

export class MongoStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Use in-memory session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    // Initialize database with sample data
    this.initializeDatabase();
  }

  // User operations
  async getUser(id: string): Promise<SimpleUser | undefined> {
    try {
      const user = await User.findById(id);
      return user ? userToSimpleUser(user) : undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<SimpleUser | undefined> {
    try {
      const user = await User.findOne({ username });
      return user ? userToSimpleUser(user) : undefined;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }
  
  async getUserByEmail(email: string): Promise<SimpleUser | undefined> {
    try {
      const user = await User.findOne({ email });
      return user ? userToSimpleUser(user) : undefined;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(userData: Omit<SimpleUser, 'id'>): Promise<SimpleUser> {
    try {
      const user = new User(userData);
      await user.save();
      return userToSimpleUser(user);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  async updateUser(id: string, userData: Partial<Omit<SimpleUser, 'id'>>): Promise<SimpleUser | undefined> {
    try {
      const user = await User.findByIdAndUpdate(id, userData, { new: true });
      return user ? userToSimpleUser(user) : undefined;
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }
  
  // Book operations
  async getBooks(page: number = 1, limit: number = 10, searchTerm?: string, genre?: string): Promise<{books: SimpleBook[], total: number}> {
    try {
      let query: any = {};
      
      if (searchTerm) {
        const searchRegex = new RegExp(searchTerm, 'i');
        query = {
          $or: [
            { title: searchRegex },
            { author: searchRegex },
            { description: searchRegex }
          ]
        };
      }
      
      if (genre) {
        query.genres = genre;
      }
      
      const total = await Book.countDocuments(query);
      const skip = (page - 1) * limit;
      
      const books = await Book.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      return {
        books: books.map(book => bookToSimpleBook(book)),
        total
      };
    } catch (error) {
      console.error("Error getting books:", error);
      return { books: [], total: 0 };
    }
  }
  
  async getBook(id: string): Promise<SimpleBook | undefined> {
    try {
      const book = await Book.findById(id);
      return book ? bookToSimpleBook(book) : undefined;
    } catch (error) {
      console.error("Error getting book:", error);
      return undefined;
    }
  }
  
  async getFeaturedBooks(): Promise<SimpleBook[]> {
    try {
      const books = await Book.find({ featured: true });
      return books.map(book => bookToSimpleBook(book));
    } catch (error) {
      console.error("Error getting featured books:", error);
      return [];
    }
  }
  
  async getBooksByGenre(genre: string, limit: number = 6): Promise<SimpleBook[]> {
    try {
      const books = await Book.find({ genres: genre }).limit(limit);
      return books.map(book => bookToSimpleBook(book));
    } catch (error) {
      console.error("Error getting books by genre:", error);
      return [];
    }
  }
  
  async createBook(bookData: Omit<SimpleBook, 'id'>): Promise<SimpleBook> {
    try {
      const book = new Book(bookData);
      await book.save();
      return bookToSimpleBook(book);
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  }
  
  async updateBook(id: string, bookData: Partial<Omit<SimpleBook, 'id'>>): Promise<SimpleBook | undefined> {
    try {
      const book = await Book.findByIdAndUpdate(id, bookData, { new: true });
      return book ? bookToSimpleBook(book) : undefined;
    } catch (error) {
      console.error("Error updating book:", error);
      return undefined;
    }
  }
  
  // Review operations
  async getReviews(bookId: string, page: number = 1, limit: number = 10): Promise<{reviews: SimpleReview[], total: number}> {
    try {
      const skip = (page - 1) * limit;
      
      const total = await Review.countDocuments({ bookId: new ObjectId(bookId) });
      
      const reviews = await Review.find({ bookId: new ObjectId(bookId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const reviewsWithData = await Promise.all(
        reviews.map(async (review) => {
          const user = await User.findById(review.userId);
          const book = await Book.findById(review.bookId);
          return reviewToSimpleReview(review, user || undefined, book || undefined);
        })
      );
      
      return { reviews: reviewsWithData, total };
    } catch (error) {
      console.error("Error getting reviews:", error);
      return { reviews: [], total: 0 };
    }
  }
  
  async getUserReviews(userId: string): Promise<SimpleReview[]> {
    try {
      const reviews = await Review.find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 });
      
      const reviewsWithData = await Promise.all(
        reviews.map(async (review) => {
          const book = await Book.findById(review.bookId);
          return reviewToSimpleReview(review, undefined, book || undefined);
        })
      );
      
      return reviewsWithData;
    } catch (error) {
      console.error("Error getting user reviews:", error);
      return [];
    }
  }
  
  async getReview(id: string): Promise<SimpleReview | undefined> {
    try {
      const review = await Review.findById(id);
      return review ? reviewToSimpleReview(review) : undefined;
    } catch (error) {
      console.error("Error getting review:", error);
      return undefined;
    }
  }
  
  async createReview(reviewData: Omit<SimpleReview, 'id' | 'createdAt' | 'user' | 'book'>): Promise<SimpleReview> {
    try {
      const review = new Review({
        ...reviewData,
        userId: new ObjectId(reviewData.userId),
        bookId: new ObjectId(reviewData.bookId)
      });
      
      await review.save();
      return reviewToSimpleReview(review);
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }
  
  async updateReview(id: string, reviewData: Partial<Omit<SimpleReview, 'id' | 'user' | 'book'>>): Promise<SimpleReview | undefined> {
    try {
      const updateData = { ...reviewData };
      
      // Convert string IDs to ObjectIds if present
      if (reviewData.userId) {
        updateData.userId = new ObjectId(reviewData.userId);
      }
      
      if (reviewData.bookId) {
        updateData.bookId = new ObjectId(reviewData.bookId);
      }
      
      const review = await Review.findByIdAndUpdate(id, updateData, { new: true });
      return review ? reviewToSimpleReview(review) : undefined;
    } catch (error) {
      console.error("Error updating review:", error);
      return undefined;
    }
  }
  
  // Reading Challenge operations
  async getChallenge(userId: string, year: number): Promise<SimpleReadingChallenge | undefined> {
    try {
      const challenge = await ReadingChallenge.findOne({ 
        userId: new ObjectId(userId),
        year 
      });
      
      return challenge ? challengeToSimpleChallenge(challenge) : undefined;
    } catch (error) {
      console.error("Error getting challenge:", error);
      return undefined;
    }
  }
  
  async createChallenge(challengeData: Omit<SimpleReadingChallenge, 'id'>): Promise<SimpleReadingChallenge> {
    try {
      const challenge = new ReadingChallenge({
        ...challengeData,
        userId: new ObjectId(challengeData.userId)
      });
      
      await challenge.save();
      return challengeToSimpleChallenge(challenge);
    } catch (error) {
      console.error("Error creating challenge:", error);
      throw error;
    }
  }
  
  async updateChallenge(id: string, challengeData: Partial<Omit<SimpleReadingChallenge, 'id'>>): Promise<SimpleReadingChallenge | undefined> {
    try {
      const updateData = { ...challengeData };
      
      // Convert string ID to ObjectId if present
      if (challengeData.userId) {
        updateData.userId = new ObjectId(challengeData.userId);
      }
      
      const challenge = await ReadingChallenge.findByIdAndUpdate(id, updateData, { new: true });
      return challenge ? challengeToSimpleChallenge(challenge) : undefined;
    } catch (error) {
      console.error("Error updating challenge:", error);
      return undefined;
    }
  }
  
  // Reading List operations
  async getUserReadingList(userId: string, status?: string): Promise<SimpleReadingList[]> {
    try {
      const query: any = { userId: new ObjectId(userId) };
      
      if (status) {
        query.status = status;
      }
      
      const readingList = await ReadingList.find(query).sort({ addedAt: -1 });
      
      // Fetch book details for each reading list item
      const listWithBooks = await Promise.all(
        readingList.map(async (item) => {
          const book = await Book.findById(item.bookId);
          return readingListToSimple(item, book || undefined);
        })
      );
      
      return listWithBooks;
    } catch (error) {
      console.error("Error getting user reading list:", error);
      return [];
    }
  }
  
  async addToReadingList(userId: string, bookId: string, status: string): Promise<SimpleReadingList> {
    try {
      // Check if the book is already in the reading list
      const existingItem = await ReadingList.findOne({
        userId: new ObjectId(userId),
        bookId: new ObjectId(bookId)
      });
      
      if (existingItem) {
        // Update existing item's status
        existingItem.status = status;
        await existingItem.save();
        
        const book = await Book.findById(existingItem.bookId);
        return readingListToSimple(existingItem, book || undefined);
      }
      
      // Create new reading list item
      const readingListItem = new ReadingList({
        userId: new ObjectId(userId),
        bookId: new ObjectId(bookId),
        status,
        addedAt: new Date()
      });
      
      await readingListItem.save();
      
      const book = await Book.findById(readingListItem.bookId);
      return readingListToSimple(readingListItem, book || undefined);
    } catch (error) {
      console.error("Error adding to reading list:", error);
      throw error;
    }
  }
  
  async removeFromReadingList(id: string): Promise<boolean> {
    try {
      const result = await ReadingList.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error removing from reading list:", error);
      return false;
    }
  }
  
  async updateReadingListStatus(id: string, status: string): Promise<SimpleReadingList | undefined> {
    try {
      const readingListItem = await ReadingList.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      
      if (!readingListItem) return undefined;
      
      const book = await Book.findById(readingListItem.bookId);
      return readingListToSimple(readingListItem, book || undefined);
    } catch (error) {
      console.error("Error updating reading list status:", error);
      return undefined;
    }
  }
  
  // Initialize database with sample data if needed
  async initializeDatabase() {
    try {
      // Check if we have any users
      const userCount = await User.countDocuments();
      
      if (userCount === 0) {
        console.log("Initializing database with sample data...");
        
        // Create admin user
        const admin = new User({
          username: "admin",
          password: "admin123", // In production, this should be hashed
          email: "admin@bookwise.com",
          fullName: "Admin User",
          bio: "Platform administrator",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
          isAdmin: true
        });
        
        await admin.save();
        
        // Add sample books
        const sampleBooks = [
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
        
        const books = await Book.insertMany(sampleBooks);
        
        // Add sample review
        const review = new Review({
          userId: admin._id,
          bookId: books[0]._id,
          content: "This psychological thriller kept me on the edge of my seat! The twist at the end completely caught me off guard. I couldn't put it down and finished it in one sitting. Highly recommend to anyone who enjoys a good mystery.",
          rating: 4,
          likesCount: 0
        });
        
        await review.save();
        
        console.log("Sample data initialized successfully");
      }
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }
}

// Instantiate the storage
// Create the MongoStorage instance conditionally based on MongoDB connectivity
// This will be initialized as part of the connection flow
let mongoStorage: MongoStorage | null = null;

export async function initializeMongoStorage(): Promise<MongoStorage | null> {
  try {
    mongoStorage = new MongoStorage();
    await mongoStorage.initializeDatabase();
    return mongoStorage;
  } catch (error) {
    console.error("Failed to initialize MongoDB storage:", error);
    return null;
  }
}