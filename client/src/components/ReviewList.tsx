import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getReviews } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import ReviewItem from "./ReviewItem";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewListProps {
  bookId: number;
}

export default function ReviewList({ bookId }: ReviewListProps) {
  const [page, setPage] = useState(1);
  const limit = 5;
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/reviews?bookId=${bookId}&page=${page}&limit=${limit}`],
    queryFn: () => getReviews(bookId, page, limit),
  });
  
  useEffect(() => {
    refetch();
  }, [page, refetch]);
  
  if (error) {
    return (
      <div className="py-4 text-center text-gray-500">
        Failed to load reviews. Please try again.
      </div>
    );
  }
  
  const loadMoreReviews = () => {
    setPage(prev => prev + 1);
  };
  
  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={index} className="border-b border-gray-200 pb-6">
        <div className="flex items-start">
          <Skeleton className="h-10 w-10 rounded-full mr-4" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16 mt-1" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex pt-4 gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">Community Reviews</h3>
      
      {isLoading ? (
        renderSkeletons()
      ) : data?.reviews && data.reviews.length > 0 ? (
        <>
          {data.reviews.map(review => (
            <ReviewItem key={review.id} review={review} />
          ))}
          
          {data.page < data.totalPages && (
            <Button 
              onClick={loadMoreReviews} 
              variant="outline" 
              className="w-full"
            >
              Load More Reviews
            </Button>
          )}
        </>
      ) : (
        <div className="py-4 text-center text-gray-500">
          No reviews yet. Be the first to write a review!
        </div>
      )}
    </div>
  );
}
