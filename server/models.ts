import mongoose, { Schema, Document } from 'mongoose';

// User Interface
export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Book Interface
export interface IBook extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

// Review Interface
export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  content: string;
  rating: number;
  aiEnhanced?: string;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Reading Challenge Interface
export interface IReadingChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  targetBooks: number;
  completedBooks: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

// Reading List Interface (for the "Want to Read" feature)
export interface IReadingList extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  addedAt: Date;
  status: string; // "want-to-read", "reading", "read", etc.
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String },
  bio: { type: String },
  avatar: { type: String },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

// Book Schema
const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String },
  price: { type: Number },
  isbn: { type: String },
  publishedDate: { type: Date },
  publisher: { type: String },
  genres: [{ type: String }],
  pages: { type: Number },
  language: { type: String },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

// Review Schema
const ReviewSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  aiEnhanced: { type: String },
  likesCount: { type: Number, default: 0 }
}, { timestamps: true });

// Reading Challenge Schema
const ReadingChallengeSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetBooks: { type: Number, required: true },
  completedBooks: { type: Number, default: 0 },
  year: { type: Number, required: true }
}, { timestamps: true });

// Reading List Schema
const ReadingListSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  addedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['want-to-read', 'reading', 'read'], default: 'want-to-read' }
}, { timestamps: true });

// Create models
export const User = mongoose.model<IUser>('User', UserSchema);
export const Book = mongoose.model<IBook>('Book', BookSchema);
export const Review = mongoose.model<IReview>('Review', ReviewSchema);
export const ReadingChallenge = mongoose.model<IReadingChallenge>('ReadingChallenge', ReadingChallengeSchema);
export const ReadingList = mongoose.model<IReadingList>('ReadingList', ReadingListSchema);