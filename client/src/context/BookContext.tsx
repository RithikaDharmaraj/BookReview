import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Book, Review } from "@/types";

type BookContextType = {
  featuredBooks: Book[];
  recentReviews: Review[];
  loadFeaturedBooks: () => Promise<void>;
  loadRecentReviews: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const loadFeaturedBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/books/featured");
      
      if (!response.ok) {
        throw new Error("Failed to load featured books");
      }
      
      const data = await response.json();
      setFeaturedBooks(data);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to load featured books";
      setError(errorMsg);
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const loadRecentReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For the homepage, we'll load reviews for the first featured book
      if (featuredBooks.length > 0) {
        const response = await fetch(`/api/reviews?bookId=${featuredBooks[0].id}&limit=2`);
        
        if (!response.ok) {
          throw new Error("Failed to load recent reviews");
        }
        
        const data = await response.json();
        setRecentReviews(data.reviews);
      }
    } catch (err: any) {
      const errorMsg = err.message || "Failed to load recent reviews";
      setError(errorMsg);
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [featuredBooks, toast]);
  
  return (
    <BookContext.Provider
      value={{
        featuredBooks,
        recentReviews,
        loadFeaturedBooks,
        loadRecentReviews,
        isLoading,
        error
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
}
