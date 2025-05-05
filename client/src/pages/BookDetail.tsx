import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { StarRating } from "@/components/StarRating";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { Book, Review } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ReadingStatus = 'reading' | 'want-to-read' | 'completed' | null;

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("details");
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>(null);
  
  // Fetch book details with reviews
  const { data, isLoading, error } = useQuery<{
    book: Book;
    reviews: Review[];
    averageRating: number;
    reviewCount: number;
  }>({
    queryKey: [`/api/books/${id}`],
  });
  
  // Fetch user's reading lists to check if this book is in any of them
  const { data: userBooksData } = useQuery<{
    reading: Book[],
    wantToRead: Book[],
    completed: Book[]
  }>({
    queryKey: ["/api/users/books"],
    enabled: isAuthenticated
  });
  
  // Effect to check if the current book is in any of the user's lists
  React.useEffect(() => {
    if (userBooksData && id) {
      const bookId = Number(id);
      if (userBooksData.reading.some((book: Book) => book.id === bookId)) {
        setReadingStatus('reading');
      } else if (userBooksData.wantToRead.some((book: Book) => book.id === bookId)) {
        setReadingStatus('want-to-read');
      } else if (userBooksData.completed.some((book: Book) => book.id === bookId)) {
        setReadingStatus('completed');
      }
    }
  }, [userBooksData, id]);
  
  // Mutation to add book to reading list
  const addToListMutation = useMutation({
    mutationFn: async (status: ReadingStatus) => {
      if (!status) return null;
      const res = await apiRequest("POST", "/api/users/books", {
        bookId: Number(id),
        status
      });
      return res.json();
    },
    onSuccess: (_data, variables) => {
      setReadingStatus(variables);
      queryClient.invalidateQueries({ queryKey: ["/api/users/books"] });
      toast({
        title: "Success!",
        description: `"${data?.book.title}" added to your ${variables?.replace('-', ' ')} list!`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update your reading list. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to remove book from reading list
  const removeFromListMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/users/books/${id}`);
      return res.json();
    },
    onSuccess: () => {
      setReadingStatus(null);
      queryClient.invalidateQueries({ queryKey: ["/api/users/books"] });
      toast({
        title: "Success!",
        description: `"${data?.book.title}" removed from your reading list.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove book from your list. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleAddToList = (status: ReadingStatus) => {
    if (!isAuthenticated) {
      toast({
        title: "Not logged in",
        description: "Please log in to add books to your reading list.",
        variant: "destructive"
      });
      return;
    }
    
    addToListMutation.mutate(status);
  };
  
  const handleRemoveFromList = () => {
    if (!isAuthenticated || !readingStatus) {
      return;
    }
    
    removeFromListMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="bg-gray-300 h-96 w-full rounded-lg"></div>
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-300 rounded w-32"></div>
                    <div className="h-10 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Book</h1>
            <p className="text-gray-600 mb-6">We couldn't load the book details. Please try again later.</p>
            <Button asChild>
              <Link href="/books">Back to Books</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const { book, reviews, averageRating, reviewCount } = data;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Book details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Book cover */}
              <div className="md:w-1/3 lg:w-1/4">
                <img 
                  src={book.coverImage} 
                  alt={`${book.title} by ${book.author}`} 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Price:</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(book.price)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      <StarRating rating={averageRating} />
                      <span className="ml-2 text-sm text-gray-600">({reviewCount} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Pages:</span>
                    <span className="text-gray-800">{book.pages}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Published:</span>
                    <span className="text-gray-800">{book.publishedDate}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Language:</span>
                    <span className="text-gray-800">{book.language}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">ISBN:</span>
                    <span className="text-gray-800">{book.isbn}</span>
                  </div>
                </div>
              </div>
              
              {/* Book details */}
              <div className="md:w-2/3 lg:w-3/4">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <h2 className="text-xl text-gray-700 mb-4">by {book.author}</h2>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                      {book.category}
                    </span>
                    {book.featured && (
                      <span className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Book Information</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li><span className="font-medium">Publisher:</span> {book.publisher}</li>
                          <li><span className="font-medium">Publication Date:</span> {book.publishedDate}</li>
                          <li><span className="font-medium">Language:</span> {book.language}</li>
                          <li><span className="font-medium">Pages:</span> {book.pages}</li>
                          <li><span className="font-medium">ISBN:</span> {book.isbn}</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Rating Breakdown</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="w-16 text-sm">5 stars</span>
                            <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-secondary-500 rounded-full" style={{ width: "60%" }}></div>
                            </div>
                            <span className="text-sm">60%</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-16 text-sm">4 stars</span>
                            <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-secondary-500 rounded-full" style={{ width: "25%" }}></div>
                            </div>
                            <span className="text-sm">25%</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-16 text-sm">3 stars</span>
                            <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-secondary-500 rounded-full" style={{ width: "10%" }}></div>
                            </div>
                            <span className="text-sm">10%</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-16 text-sm">2 stars</span>
                            <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-secondary-500 rounded-full" style={{ width: "3%" }}></div>
                            </div>
                            <span className="text-sm">3%</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-16 text-sm">1 star</span>
                            <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-secondary-500 rounded-full" style={{ width: "2%" }}></div>
                            </div>
                            <span className="text-sm">2%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="description">
                    <div className="prose book-content max-w-none text-gray-700">
                      <p className="text-lg leading-relaxed">{book.description}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    <div className="space-y-6">
                      {reviews.length > 0 ? (
                        reviews.map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this book!</p>
                          {isAuthenticated ? (
                            <Button asChild>
                              <Link href={`/books/${id}/review`}>Write a Review</Link>
                            </Button>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm text-gray-500">Please log in to write a review</p>
                              <Button asChild>
                                <Link href="/login">Log in</Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {reviews.length > 0 && isAuthenticated && (
                        <div className="flex justify-center mt-6">
                          <Button asChild>
                            <Link href={`/books/${id}/review`}>Write a Review</Link>
                          </Button>
                        </div>
                      )}
                      
                      {reviews.length > 0 && !isAuthenticated && (
                        <div className="text-center mt-6 space-y-2">
                          <p className="text-sm text-gray-500">Please log in to write a review</p>
                          <Button asChild>
                            <Link href="/login">Log in</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex flex-wrap gap-4 mt-8 items-start">
                  {readingStatus ? (
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <Badge className="mb-1" variant="outline">
                        {readingStatus === 'reading' && 'Currently Reading'}
                        {readingStatus === 'want-to-read' && 'Want to Read'}
                        {readingStatus === 'completed' && 'Completed'}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="w-full sm:w-auto">
                            Update Status
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {readingStatus !== 'reading' && (
                            <DropdownMenuItem onSelect={() => handleAddToList('reading')}>
                              Currently Reading
                            </DropdownMenuItem>
                          )}
                          {readingStatus !== 'want-to-read' && (
                            <DropdownMenuItem onSelect={() => handleAddToList('want-to-read')}>
                              Want to Read
                            </DropdownMenuItem>
                          )}
                          {readingStatus !== 'completed' && (
                            <DropdownMenuItem onSelect={() => handleAddToList('completed')}>
                              Completed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onSelect={handleRemoveFromList}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            Remove from List
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-full sm:w-auto">
                          Add to Reading List
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => handleAddToList('reading')}>
                          Currently Reading
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleAddToList('want-to-read')}>
                          Want to Read
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleAddToList('completed')}>
                          Completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  
                  {isAuthenticated && (
                    <Button variant="outline" className="w-full sm:w-auto" asChild>
                      <Link href={`/books/${id}/review`}>
                        Write a Review
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Similar books section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* This would ideally be fetched from the API based on the book category */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                  <div className="bg-gray-300 h-48 w-32 rounded-md animate-pulse"></div>
                  <div className="mt-4 text-center space-y-2 w-full">
                    <div className="h-5 bg-gray-300 rounded mx-auto w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded mx-auto w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
