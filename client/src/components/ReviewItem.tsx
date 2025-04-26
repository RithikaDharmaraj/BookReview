import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUpIcon, MessageSquareIcon, FlagIcon } from "lucide-react";
import { Review } from "@/types";
import StarRating from "./StarRating";
import { Separator } from "@/components/ui/separator";

interface ReviewItemProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) return "today";
    if (diffInDays === 1) return "yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return reviewDate.toLocaleDateString();
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex items-start">
        <Avatar className="h-10 w-10 mr-4">
          <AvatarImage 
            src={review.user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"} 
            alt={review.user?.username || "User"} 
          />
          <AvatarFallback>
            {review.user?.username?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900">{review.user?.fullName || review.user?.username}</h4>
              <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
            </div>
            <StarRating initialRating={review.rating} onChange={() => {}} disabled size="sm" />
          </div>
          <p className="text-gray-700 mt-2">
            {review.content}
          </p>
          
          {review.aiEnhanced && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Original review:</p>
              <p className="text-gray-600 text-sm italic">{review.aiEnhanced}</p>
            </div>
          )}
          
          <div className="flex items-center mt-4 text-sm">
            <button className="text-gray-500 hover:text-primary flex items-center transition-all">
              <ThumbsUpIcon className="mr-1 h-4 w-4" /> {review.likesCount}
            </button>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <button className="text-gray-500 hover:text-primary flex items-center transition-all">
              <MessageSquareIcon className="mr-1 h-4 w-4" /> {Math.floor(Math.random() * 10)} replies
            </button>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <button className="text-gray-500 hover:text-primary flex items-center transition-all">
              <FlagIcon className="mr-1 h-4 w-4" /> Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
