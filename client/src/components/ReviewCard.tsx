import { Review } from "@shared/schema";
import { StarRating } from "./StarRating";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ExtendedReview extends Review {
  user?: {
    id: number;
    name: string;
    username: string;
    profileImage?: string;
  };
}

interface ReviewCardProps {
  review: ExtendedReview;
  bookTitle?: string;
}

export function ReviewCard({ review, bookTitle }: ReviewCardProps) {
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50));
  
  const formattedDate = review.createdAt 
    ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
    : "recently";
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  
  const handleLike = () => {
    setLikes(likes + 1);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-4 mb-5">
        {/* User Avatar with improved styling */}
        <Avatar className="h-12 w-12 border-2 border-indigo-100 shadow-sm">
          <AvatarImage src={review.user?.profileImage} alt={review.user?.name} />
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-medium">
            {review.user?.name ? getInitials(review.user.name) : "U"}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h4 className="font-medium text-gray-900">{review.user?.name || "Anonymous"}</h4>
          <div className="flex items-center">
            <StarRating rating={review.rating} />
            <span className="ml-2 text-sm font-medium text-indigo-600">{review.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="ml-auto text-sm text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full font-medium">{formattedDate}</div>
      </div>
      
      {/* Review Title with enhanced styling */}
      <h3 className="font-bold text-lg mb-2.5 text-gray-900">{review.title}</h3>
      
      {/* Review Content with enhanced styling */}
      <div className="relative mb-5">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-100 rounded-full"></div>
        <p className="text-gray-700 pl-4 text-sm leading-relaxed book-content">
          {review.content}
        </p>
      </div>
      
      <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
        {/* Book Title Reference */}
        {bookTitle && (
          <span className="text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-md">{bookTitle}</span>
        )}
        
        {/* Interactive Buttons */}
        <div className="flex space-x-4 text-gray-600">
          <Button variant="ghost" size="sm" 
            className="hover:text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md" 
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4" /> {likes}
          </Button>
          <Button variant="ghost" size="sm" 
            className="hover:text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md"
          >
            <MessageSquare className="h-4 w-4" /> Reply
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
