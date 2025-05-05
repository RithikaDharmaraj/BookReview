import { 
  users, type User, type InsertUser,
  books, type Book, type InsertBook,
  reviews, type Review, type InsertReview 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Book operations
  getBooks(page: number, limit: number, category?: string, search?: string, sort?: string, order?: 'asc' | 'desc'): Promise<{books: Book[], total: number}>;
  getBook(id: number): Promise<Book | undefined>;
  getFeaturedBooks(limit: number): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  
  // Review operations
  getReviewsByBook(bookId: number): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, reviewData: Partial<Review>): Promise<Review | undefined>;
  
  // Reading list operations
  getUserBooks(userId: number): Promise<{reading: Book[], wantToRead: Book[], completed: Book[]}>;
  addBookToUserList(userId: number, bookId: number, status: string): Promise<void>;
  removeBookFromUserList(userId: number, bookId: number): Promise<void>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private reviews: Map<number, Review>;
  private userBooks: Map<number, Map<number, string>>; // userId -> {bookId -> status}
  
  private userId: number;
  private bookId: number;
  private reviewId: number;
  
  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.reviews = new Map();
    this.userBooks = new Map();
    
    this.userId = 1;
    this.bookId = 1;
    this.reviewId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      bio: insertUser.bio || null,
      profileImage: insertUser.profileImage || null 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Book operations
  async getBooks(page: number = 1, limit: number = 10, category?: string, search?: string, sort: string = 'title', order: 'asc' | 'desc' = 'asc'): Promise<{books: Book[], total: number}> {
    let filteredBooks = Array.from(this.books.values());
    
    if (category) {
      filteredBooks = filteredBooks.filter(book => book.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchLower) || 
        book.author.toLowerCase().includes(searchLower) ||
        book.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting based on the sort parameter
    filteredBooks.sort((a, b) => {
      let comparison = 0;
      
      switch (sort) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'price':
          // Remove the $ sign and convert to number for comparison
          const priceA = parseFloat(a.price.replace('$', ''));
          const priceB = parseFloat(b.price.replace('$', ''));
          comparison = priceA - priceB;
          break;
        case 'date':
          // Compare publishedDate if available
          if (a.publishedDate && b.publishedDate) {
            comparison = new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
          }
          break;
        // Add more cases for other sort options as needed
        default:
          comparison = a.title.localeCompare(b.title);
      }
      
      // Apply the sort order (asc or desc)
      return order === 'asc' ? comparison : -comparison;
    });
    
    const startIndex = (page - 1) * limit;
    const paginatedBooks = filteredBooks.slice(startIndex, startIndex + limit);
    
    return {
      books: paginatedBooks,
      total: filteredBooks.length
    };
  }
  
  async getBook(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }
  
  async getFeaturedBooks(limit: number = 4): Promise<Book[]> {
    const featuredBooks = Array.from(this.books.values())
      .filter(book => book.featured)
      .slice(0, limit);
    
    return featuredBooks;
  }
  
  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.bookId++;
    const createdAt = new Date();
    const book: Book = { 
      ...insertBook, 
      id, 
      createdAt,
      featured: insertBook.featured || null,
      isbn: insertBook.isbn || null,
      language: insertBook.language || 'English',
      pages: insertBook.pages || null,
      publishedDate: insertBook.publishedDate || null,
      publisher: insertBook.publisher || null
    };
    this.books.set(id, book);
    return book;
  }
  
  // Review operations
  async getReviewsByBook(bookId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.bookId === bookId);
  }
  
  async getReviewsByUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.userId === userId);
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const createdAt = new Date();
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt,
      aiRefinedContent: insertReview.aiRefinedContent || null
    };
    this.reviews.set(id, review);
    return review;
  }
  
  async updateReview(id: number, reviewData: Partial<Review>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;
    
    const updatedReview = { ...review, ...reviewData };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }
  
  // Reading list operations
  async getUserBooks(userId: number): Promise<{reading: Book[], wantToRead: Book[], completed: Book[]}> {
    const userBookMap = this.userBooks.get(userId) || new Map<number, string>();
    const reading: Book[] = [];
    const wantToRead: Book[] = [];
    const completed: Book[] = [];
    
    // Group books by their status
    // Using Array.from to convert the Map entries to an array for iteration
    Array.from(userBookMap.entries()).forEach(([bookId, status]) => {
      const book = this.books.get(Number(bookId));
      if (book) {
        switch (status) {
          case 'reading':
            reading.push(book);
            break;
          case 'want-to-read':
            wantToRead.push(book);
            break;
          case 'completed':
            completed.push(book);
            break;
        }
      }
    });
    
    return {
      reading,
      wantToRead,
      completed
    };
  }
  
  async addBookToUserList(userId: number, bookId: number, status: string): Promise<void> {
    // Validate user and book exist
    const user = await this.getUser(userId);
    const book = await this.getBook(bookId);
    if (!user || !book) {
      throw new Error('User or book not found');
    }
    
    // Get or create user's book map
    if (!this.userBooks.has(userId)) {
      this.userBooks.set(userId, new Map<number, string>());
    }
    
    const userBookMap = this.userBooks.get(userId)!;
    userBookMap.set(bookId, status);
  }
  
  async removeBookFromUserList(userId: number, bookId: number): Promise<void> {
    const userBookMap = this.userBooks.get(userId);
    if (userBookMap) {
      userBookMap.delete(bookId);
    }
  }
  
  // Initialize sample data
  private initializeSampleData() {
    // Sample users
    const sampleUsers: InsertUser[] = [
      {
        username: "johndoe",
        password: "$2b$10$P/Vz5fBRhGrhDCVQjSlMOuKigYZW0Z2wfGKHp4e.FaCBxbvqCDGL2", // password: password123
        email: "john@example.com",
        name: "John Doe",
        bio: "Avid reader and book enthusiast",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      {
        username: "sarahjohnson",
        password: "$2b$10$P/Vz5fBRhGrhDCVQjSlMOuKigYZW0Z2wfGKHp4e.FaCBxbvqCDGL2", // password: password123
        email: "sarah@example.com",
        name: "Sarah Johnson",
        bio: "Book lover and aspiring writer",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    ];
    
    sampleUsers.forEach(user => {
      this.createUser(user);
    });
    
    // Sample books
    const sampleBooks: InsertBook[] = [
      {
        title: "Atomic Habits",
        author: "James Clear",
        description: "Tiny changes, remarkable results. An easy and proven way to build good habits and break bad ones.",
        coverImage: "https://images.unsplash.com/photo-1603186741833-4a7cf661bcc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        price: "$18.99",
        category: "self-help",
        featured: true,
        publishedDate: "2018-10-16",
        publisher: "Penguin Random House",
        pages: 320,
        isbn: "978-0735211292"
      },
      {
        title: "Deep Work",
        author: "Cal Newport",
        description: "Rules for focused success in a distracted world. Learn to focus without distraction.",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        price: "$16.99",
        category: "business",
        featured: true,
        publishedDate: "2016-01-05",
        publisher: "Grand Central Publishing",
        pages: 296,
        isbn: "978-1455586691"
      },
      {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        description: "A groundbreaking tour of the mind explaining the two systems that drive the way we think.",
        coverImage: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        price: "$21.99",
        category: "psychology",
        featured: true,
        publishedDate: "2011-10-25",
        publisher: "Farrar, Straus and Giroux",
        pages: 499,
        isbn: "978-0374533557"
      },
      {
        title: "Educated",
        author: "Tara Westover",
        description: "A memoir about a girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD.",
        coverImage: "https://images.unsplash.com/photo-1525802637627-583e14033d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        price: "$14.99",
        category: "biography",
        featured: true,
        publishedDate: "2018-02-20",
        publisher: "Random House",
        pages: 334,
        isbn: "978-0399590504"
      },
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        description: "Between life and death there is a library filled with books containing different versions of your life.",
        coverImage: "https://images.unsplash.com/photo-1587387119725-9d6bac0f22fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        price: "$22.99",
        category: "fiction",
        featured: false,
        publishedDate: "2020-09-29",
        publisher: "Viking",
        pages: 304,
        isbn: "978-0525559474"
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
        coverImage: "https://images.unsplash.com/photo-1695653423053-08c5753c1924?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        price: "$24.99",
        category: "science",
        featured: false,
        publishedDate: "2021-05-04",
        publisher: "Ballantine Books",
        pages: 496,
        isbn: "978-0593135204"
      },
      {
        title: "The Four Winds",
        author: "Kristin Hannah",
        description: "An epic novel of love and heroism and hope, set against the backdrop of the Great Depression.",
        coverImage: "https://images.unsplash.com/photo-1633477189729-9290b3261d0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        price: "$19.99",
        category: "fiction",
        featured: false,
        publishedDate: "2021-02-02",
        publisher: "St. Martin's Press",
        pages: 464,
        isbn: "978-1250178602"
      },
      {
        title: "The Lincoln Highway",
        author: "Amor Towles",
        description: "A captivating journey through 1950s America following the adventures of four boys.",
        coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        price: "$27.99",
        category: "fiction",
        featured: false,
        publishedDate: "2021-10-05",
        publisher: "Viking",
        pages: 592,
        isbn: "978-0735222359"
      }
    ];
    
    sampleBooks.forEach(book => {
      this.createBook(book);
    });
    
    // Sample reviews
    const sampleReviews: InsertReview[] = [
      {
        title: "A captivating journey through time",
        content: "I couldn't put down \"The Lincoln Highway\" once I started. Amor Towles has a gift for creating characters that feel so real and relatable. The historical setting is meticulously researched, and the plot takes unexpected turns that kept me engaged throughout.",
        rating: 4,
        bookId: 8,
        userId: 1
      },
      {
        title: "Life-changing perspective on habits",
        content: "\"Atomic Habits\" has completely transformed how I approach personal development. James Clear breaks down the science of habit formation in a way that's both practical and inspiring. I've already implemented several of his strategies and have seen real improvements in my daily routines.",
        rating: 5,
        bookId: 1,
        userId: 2
      },
      {
        title: "An essential book for modern work",
        content: "Deep Work provides practical strategies for focusing in a distracted world. I particularly found the concept of scheduling deep work blocks helpful for my productivity.",
        rating: 4,
        bookId: 2,
        userId: 1
      },
      {
        title: "Mind-blowing psychological insights",
        content: "Kahneman's explanations of System 1 and System 2 thinking have fundamentally changed how I understand my own decision making. Highly recommended for anyone interested in cognitive psychology.",
        rating: 5,
        bookId: 3,
        userId: 2
      }
    ];
    
    sampleReviews.forEach(review => {
      this.createReview(review);
    });
    
    // Sample user books (reading lists)
    this.userBooks.set(1, new Map<number, string>([
      [1, 'reading'],      // John is reading Atomic Habits
      [3, 'completed'],    // John has completed Thinking, Fast and Slow
      [5, 'want-to-read'], // John wants to read The Midnight Library
    ]));
    
    this.userBooks.set(2, new Map<number, string>([
      [2, 'reading'],      // Sarah is reading Deep Work
      [4, 'completed'],    // Sarah has completed Educated
      [6, 'want-to-read'], // Sarah wants to read Project Hail Mary
    ]));
  }
}

export const storage = new MemStorage();
