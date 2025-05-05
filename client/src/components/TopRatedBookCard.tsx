import { Link } from "wouter";
import { Book } from "@shared/schema";
import { StarRating } from "./StarRating";
import { MessageSquare, Eye } from "lucide-react";

interface TopRatedBookProps {
  book: Book;
  rating: number;
  reviewCount: number;
  readCount: number;
}

export default function TopRatedBookCard({ book, rating, reviewCount, readCount }: TopRatedBookProps) {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="bg-white rounded-xl shadow-md p-5 flex gap-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 group">
        {/* Book cover with effect */}
        <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
          <img 
            src={book.coverImage} 
            alt={`${book.title} by ${book.author}`} 
            className="w-24 h-36 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="flex-1">
          {/* Top row with title and rating */}
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{book.title}</h3>
            <div className="flex items-center bg-indigo-50 text-indigo-600 font-medium text-sm px-2 py-0.5 rounded-md">
              <StarRating rating={rating} max={1} size="sm" showEmpty={false} />
              <span className="ml-1">{rating.toFixed(1)}</span>
            </div>
          </div>
          
          {/* Author with styling */}
          <p className="text-sm text-gray-500 mb-2 italic">{book.author}</p>
          
          {/* Description with slight styling */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 book-content leading-relaxed">
            {book.description}
          </p>
          
          {/* Stats with enhanced styling */}
          <div className="flex items-center mt-auto pt-1 border-t border-gray-100">
            <span className="flex items-center text-xs bg-gray-100 rounded-full px-2.5 py-1 mr-3 text-gray-700 font-medium">
              <MessageSquare className="h-3 w-3 mr-1 text-indigo-500" /> {reviewCount} reviews
            </span>
            <span className="flex items-center text-xs bg-gray-100 rounded-full px-2.5 py-1 text-gray-700 font-medium">
              <Eye className="h-3 w-3 mr-1 text-indigo-500" /> {readCount}k reads
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
