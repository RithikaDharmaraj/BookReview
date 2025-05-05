import { Review } from "@shared/schema";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ReviewListProps {
  reviews: Review[];
  bookId?: number;
  bookTitle?: string;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export default function ReviewList({ 
  reviews, 
  bookId, 
  bookTitle, 
  isLoading, 
  isAuthenticated 
}: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(2).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gray-300 rounded-full h-12 w-12"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-1/6"></div>
            </div>
            <div className="h-5 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="space-y-2 mb-3">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No reviews yet. Be the first to review {bookTitle || 'this book'}!</p>
        {isAuthenticated && bookId ? (
          <Button asChild>
            <Link href={`/books/${bookId}/review`}>Write a Review</Link>
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Please log in to write a review</p>
            <Button asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} bookTitle={bookTitle} />
      ))}
      
      {bookId && (
        <div className="flex justify-center mt-6">
          {isAuthenticated ? (
            <Button asChild>
              <Link href={`/books/${bookId}/review`}>Write a Review</Link>
            </Button>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">Please log in to write a review</p>
              <Button asChild>
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
