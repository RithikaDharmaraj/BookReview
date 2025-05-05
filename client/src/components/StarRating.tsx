import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showEmpty?: boolean;
  className?: string;
}

export function StarRating({ rating, max = 5, size = "sm", showEmpty = true, className = "" }: StarRatingProps) {
  // Calculate full stars, half stars, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);
  
  // Determine size classes
  const sizeClass = {
    sm: "h-3.5 w-3.5 mx-0.5",
    md: "h-5 w-5 mx-0.5",
    lg: "h-6 w-6 mx-0.5",
  }[size];
  
  return (
    <div className={`flex items-center ${className}`}>
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <div key={`full-${i}`} className="relative">
          {/* Gold fill gradient */}
          <Star 
            className={`${sizeClass} fill-yellow-400 text-yellow-400 drop-shadow-sm`} 
          />
        </div>
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${sizeClass} fill-yellow-400 text-yellow-400`} />
          </div>
          <Star className={`${sizeClass} text-gray-300`} />
        </div>
      )}
      
      {/* Empty stars */}
      {showEmpty && [...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`${sizeClass} text-gray-300`} />
      ))}
    </div>
  );
}
