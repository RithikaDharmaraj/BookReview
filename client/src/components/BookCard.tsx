import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Book } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const addToReadingList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add books to your reading list",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Added to list",
      description: `${book.title} has been added to your reading list`,
    });
  };

  const formatRating = (rating: number) => {
    return rating % 1 === 0 ? rating.toFixed(1) : rating.toFixed(1);
  };

  // Mock data for display purposes
  const rating = 4 + Math.random();
  const reviewCount = Math.floor(Math.random() * 5000) + 500;
  const isBestseller = book.featured;
  const isNew = !isBestseller && Math.random() > 0.7;

  return (
    <Card className="book-card bg-white rounded-lg shadow-card hover:shadow-card-hover overflow-hidden transition-all hover:-translate-y-1 h-full">
      <div className="relative pt-[140%]">
        <Link href={`/books/${book.id}`}>
          <img 
            src={book.coverImage} 
            alt={`Book cover for ${book.title}`} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {isBestseller && (
            <Badge className="absolute top-3 right-3 bg-secondary text-white">
              BESTSELLER
            </Badge>
          )}
          {isNew && !isBestseller && (
            <Badge className="absolute top-3 right-3 bg-accent text-white">
              NEW
            </Badge>
          )}
        </Link>
      </div>
      <CardContent className="p-4">
        <Link href={`/books/${book.id}`}>
          <h3 className="font-heading font-bold text-gray-900 text-lg mb-1 hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 mr-1">
            <StarIcon className="h-4 w-4 fill-current" />
            <StarIcon className="h-4 w-4 fill-current" />
            <StarIcon className="h-4 w-4 fill-current" />
            <StarIcon className="h-4 w-4 fill-current" />
            <StarIcon className="h-4 w-4 fill-current" strokeWidth={2} className={rating < 4.5 ? "fill-none" : "fill-current"} />
          </div>
          <span className="text-sm text-gray-600">{formatRating(rating)} ({reviewCount} reviews)</span>
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{book.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-primary">${book.price?.toFixed(2)}</span>
          <Button
            size="sm"
            className="text-xs bg-primary hover:bg-primary-dark text-white font-medium transition-all"
            onClick={addToReadingList}
          >
            Add to List
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
