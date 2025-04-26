import { useState } from "react";
import { StarIcon } from "lucide-react";

interface StarRatingProps {
  initialRating?: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ 
  initialRating = 0, 
  onChange, 
  disabled = false,
  size = "md" 
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleSetRating = (value: number) => {
    if (disabled) return;
    setRating(value);
    onChange(value);
  };
  
  const starSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  
  const sizeClass = starSizes[size];

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={`text-yellow-400 ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={() => handleSetRating(value)}
          onMouseEnter={() => setHoverRating(value)}
          onMouseLeave={() => setHoverRating(0)}
          disabled={disabled}
          aria-label={`Rate ${value} of 5 stars`}
        >
          <StarIcon 
            className={`${sizeClass} ${(hoverRating || rating) >= value ? "fill-current" : "fill-none"}`} 
          />
        </button>
      ))}
    </div>
  );
}
