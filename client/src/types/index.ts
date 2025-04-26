export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  price?: number;
  isbn?: string;
  publishedDate?: Date;
  publisher?: string;
  genres?: string[];
  pages?: number;
  language?: string;
  featured?: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  isAdmin: boolean;
}

export interface Review {
  id: number;
  userId: number;
  bookId: number;
  content: string;
  rating: number;
  aiEnhanced?: string;
  likesCount: number;
  createdAt: Date;
  user?: {
    id: number;
    username: string;
    fullName?: string;
    avatar?: string;
  };
  book?: {
    id: number;
    title: string;
    author: string;
    coverImage?: string;
  };
}

export interface ReadingChallenge {
  id: number;
  userId: number;
  targetBooks: number;
  completedBooks: number;
  year: number;
}

export interface Category {
  name: string;
  icon: string;
  count: number;
}
