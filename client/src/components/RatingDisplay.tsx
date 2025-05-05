import { StarRating } from "@/components/StarRating";

interface RatingDisplayProps {
  rating: number;
  reviewCount: number;
  showBreakdown?: boolean;
  distribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export default function RatingDisplay({ 
  rating, 
  reviewCount, 
  showBreakdown = false,
  distribution = { 1: 2, 2: 3, 3: 10, 4: 25, 5: 60 }
}: RatingDisplayProps) {
  // Calculate total for percentages
  const total = showBreakdown ? 
    Object.values(distribution).reduce((sum, count) => sum + count, 0) : 0;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="mr-4">
          <div className="text-4xl font-bold text-gray-900">{rating.toFixed(1)}</div>
          <div className="flex mt-1">
            <StarRating rating={rating} />
          </div>
          <div className="text-sm text-gray-500 mt-1">{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</div>
        </div>
        
        {showBreakdown && total > 0 && (
          <div className="flex-1">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star as keyof typeof distribution] || 0;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={star} className="flex items-center">
                    <span className="w-16 text-sm">{star} stars</span>
                    <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-secondary-500 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{Math.round(percentage)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
