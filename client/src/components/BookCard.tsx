import { Link } from "wouter";
import { formatPrice } from "@/lib/utils";
import { Book } from "@shared/schema";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface BookCardProps {
  book: Book;
  averageRating?: number;
}

export function BookCard({ book, averageRating = 0 }: BookCardProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  // Mutation to add a book to a user's reading list
  const addBookMutation = useMutation({
    mutationFn: async (status: 'reading' | 'want-to-read' | 'completed') => {
      const res = await apiRequest("POST", "/api/users/books", { 
        bookId: book.id, 
        status
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/books"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add book to your list. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleAddToList = (status: 'reading' | 'want-to-read' | 'completed') => (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Not logged in",
        description: "Please log in to add books to your reading list.",
        variant: "destructive"
      });
      return;
    }
    
    addBookMutation.mutate(status);
    toast({
      title: "Success!",
      description: `"${book.title}" added to your ${status.replace('-', ' ')} list!`,
    });
  };
  
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative h-full group">
      <Link href={`/books/${book.id}`}>
        {/* Cover image with gradient overlay */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          <img 
            src={book.coverImage}
            alt={`${book.title} by ${book.author}`} 
            className="w-full h-60 object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          {/* Category badge */}
          <div className="absolute top-3 left-3 bg-indigo-600/90 text-white text-xs px-2.5 py-1 rounded-full z-20 uppercase tracking-wide font-medium">
            {book.category}
          </div>
        </div>
        
        <div className="p-5">
          {/* Rating */}
          <div className="flex space-x-1 mb-3">
            <StarRating rating={averageRating} />
            <span className="ml-1 text-indigo-600 text-sm font-medium">{averageRating.toFixed(1)}</span>
          </div>
          
          {/* Book info */}
          <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1.5 text-lg leading-tight line-clamp-1">{book.title}</h3>
          <p className="text-sm text-gray-500 mb-3 italic">{book.author}</p>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 book-content leading-relaxed">
            {book.description}
          </p>
          
          {/* Price and action button */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-indigo-600 font-bold bg-indigo-50 py-1 px-3 rounded-lg">{formatPrice(book.price)}</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" 
                  className="text-xs bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-sm hover:shadow-md transition-all duration-200" 
                  variant="default" 
                  onClick={(e) => e.preventDefault()}
                >
                  Add to List
                  <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleAddToList('reading')(new MouseEvent('click') as any)}>
                  Currently Reading
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAddToList('want-to-read')(new MouseEvent('click') as any)}>
                  Want to Read
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAddToList('completed')(new MouseEvent('click') as any)}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BookCard;
