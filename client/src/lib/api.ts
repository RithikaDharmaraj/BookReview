import { apiRequest } from "./queryClient";
import { Book, Review, User } from "@/types";

// Books API
export async function getFeaturedBooks(): Promise<Book[]> {
  const res = await fetch("/api/books/featured");
  if (!res.ok) throw new Error("Failed to fetch featured books");
  return res.json();
}

export async function getBooks(page = 1, limit = 10, searchTerm?: string, genre?: string): Promise<{
  books: Book[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> {
  let url = `/api/books?page=${page}&limit=${limit}`;
  if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
  if (genre) url += `&genre=${encodeURIComponent(genre)}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function getBooksByGenre(genre: string, limit = 6): Promise<Book[]> {
  const res = await fetch(`/api/books/genre/${encodeURIComponent(genre)}?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch books in ${genre} genre`);
  return res.json();
}

export async function getBook(id: number): Promise<Book> {
  const res = await fetch(`/api/books/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch book with ID ${id}`);
  return res.json();
}

export async function addBook(book: Omit<Book, "id">, user: User): Promise<Book> {
  const res = await apiRequest("POST", "/api/books", { book, user });
  return res.json();
}

// Reviews API
export async function getReviews(bookId: number, page = 1, limit = 10): Promise<{
  reviews: Review[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> {
  const res = await fetch(`/api/reviews?bookId=${bookId}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch reviews for book ${bookId}`);
  return res.json();
}

export async function getUserReviews(userId: number): Promise<Review[]> {
  const res = await fetch(`/api/reviews/user/${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch reviews for user ${userId}`);
  return res.json();
}

export async function addReview(review: {
  userId: number;
  bookId: number;
  content: string;
  rating: number;
  aiEnhanced?: string;
}): Promise<Review> {
  const res = await apiRequest("POST", "/api/reviews", review);
  return res.json();
}

export async function refineReview(content: string): Promise<{
  original: string;
  refined: string;
}> {
  const res = await apiRequest("POST", "/api/reviews/refine", { content });
  return res.json();
}

// User API
export async function getUser(id: number): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch user with ID ${id}`);
  return res.json();
}

export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
  const res = await apiRequest("PUT", `/api/users/${id}`, userData);
  return res.json();
}

// Authentication
export async function login(username: string, password: string): Promise<User> {
  const res = await apiRequest("POST", "/api/login", { username, password });
  return res.json();
}

export async function register(userData: {
  username: string;
  password: string;
  email: string;
  fullName?: string;
}): Promise<User> {
  const res = await apiRequest("POST", "/api/register", userData);
  return res.json();
}
