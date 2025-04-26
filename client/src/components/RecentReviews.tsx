import { useEffect } from "react";
import { Link } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StarIcon, ThumbsUpIcon, MessageSquareIcon } from "lucide-react";
import { useBooks } from "@/context/BookContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function RecentReviews() {
  const { recentReviews, loadRecentReviews, isLoading, featuredBooks } = useBooks();

  useEffect(() => {
    if (featuredBooks.length > 0) {
      loadRecentReviews();
    }
  }, [featuredBooks, loadRecentReviews]);

  // Sample reviews when we don't have real ones yet
  const sampleReviews = [
    {
      id: 1,
      user: {
        username: "sarahjohnson",
        fullName: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      rating: 4,
      bookId: 1,
      book: {
        title: "The Silent Patient",
        id: 1
      },
      content: "This psychological thriller kept me on the edge of my seat! The twist at the end completely caught me off guard. I couldn't put it down and finished it in one sitting. Highly recommend to anyone who enjoys a good mystery.",
      likesCount: 42
    },
    {
      id: 2,
      user: {
        username: "michaelchen",
        fullName: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      rating: 3.5,
      bookId: 3,
      book: {
        title: "Atomic Habits",
        id: 3
      },
      content: "A practical guide to building good habits and breaking bad ones. Clear provides actionable advice that you can implement immediately. I've started using the 2-minute rule and it's already making a difference in my productivity.",
      likesCount: 26
    }
  ];

  const displayReviews = recentReviews.length > 0 ? recentReviews : sampleReviews;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) return "today";
    if (diffInDays === 1) return "yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const renderSkeletons = () => {
    return Array(2).fill(0).map((_, index) => (
      <Card key={index} className="bg-background-light">
        <CardContent className="p-6">
          <div className="flex items-start">
            <Skeleton className="h-10 w-10 rounded-full mr-4" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16 mt-1" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-full mt-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center mt-4 gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">Recent Community Reviews</h2>
          <Link 
            href="/browse" 
            className="text-primary hover:text-primary-dark font-medium flex items-center gap-1"
          >
            View All <i className="fas fa-arrow-right text-sm"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading 
            ? renderSkeletons()
            : displayReviews.map((review) => (
                <div key={review.id} className="bg-background-light rounded-lg p-6">
                  <div className="flex items-start">
                    <Avatar className="w-10 h-10 mr-4">
                      <AvatarImage 
                        src={review.user?.avatar} 
                        alt={review.user?.username} 
                      />
                      <AvatarFallback>{review.user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{review.user?.fullName || review.user?.username}</h4>
                          <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                        <div className="flex text-yellow-400 text-sm">
                          {Array(5).fill(0).map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(review.rating) ? "fill-current" : "stroke-current fill-none"}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <Link href={`/books/${review.bookId}`}>
                        <h3 className="font-heading font-bold text-gray-900 mt-2 hover:text-primary transition-colors">
                          {review.book?.title}
                        </h3>
                      </Link>
                      <p className="text-gray-700 text-sm mt-2">
                        {review.content}
                      </p>
                      <div className="flex items-center mt-4 text-sm">
                        <button className="text-gray-500 hover:text-primary flex items-center transition-all">
                          <ThumbsUpIcon className="mr-1 h-4 w-4" /> {review.likesCount}
                        </button>
                        <span className="mx-2 text-gray-300">|</span>
                        <button className="text-gray-500 hover:text-primary flex items-center transition-all">
                          <MessageSquareIcon className="mr-1 h-4 w-4" /> {Math.floor(Math.random() * 10)} comments
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}
