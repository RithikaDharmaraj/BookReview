import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/lib/api";
import BookCard from "@/components/BookCard";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Helmet } from "react-helmet";

export default function BrowseBooksPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialSearchTerm = searchParams.get("search") || "";
  const initialGenre = searchParams.get("genre") || "";
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [inputValue, setInputValue] = useState(initialSearchTerm);
  const [genre, setGenre] = useState(initialGenre);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const limit = 12;
  
  // Query for books with current filters
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/books?page=${page}&limit=${limit}${searchTerm ? `&search=${searchTerm}` : ""}${genre ? `&genre=${genre}` : ""}`],
    queryFn: () => getBooks(page, limit, searchTerm, genre),
  });
  
  // Update page title and reset page when filters change
  useEffect(() => {
    let title = "Browse Books";
    if (searchTerm) title += ` - Search: ${searchTerm}`;
    if (genre) title += ` - Genre: ${genre}`;
    
    document.title = `BookWise - ${title}`;
    setPage(1);
  }, [searchTerm, genre]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(inputValue);
  };
  
  const handleFilterChange = (newGenre: string) => {
    setGenre(newGenre === genre ? "" : newGenre);
    setIsFilterOpen(false);
  };
  
  const renderSkeletons = () => {
    return Array(limit).fill(0).map((_, index) => (
      <div key={index} className="book-card-skeleton">
        <div className="relative pt-[140%] bg-gray-200 rounded-t-lg">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="p-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Helmet>
        <title>BookWise - Browse Books</title>
        <meta name="description" content="Browse our extensive collection of books, filter by genre, and find your next great read." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm">
          <a href="/" className="text-gray-500 hover:text-primary">Home</a>
          <ChevronRight className="text-gray-400 mx-2 h-4 w-4" />
          <span className="text-gray-900">Browse Books</span>
          {genre && (
            <>
              <ChevronRight className="text-gray-400 mx-2 h-4 w-4" />
              <span className="text-primary">{genre}</span>
            </>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            {searchTerm ? `Search Results: "${searchTerm}"` : genre ? `${genre} Books` : "Browse All Books"}
          </h1>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 md:w-60">
              <Input
                type="text"
                placeholder="Search books..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pr-10"
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  <Filters selectedGenre={genre} onGenreChange={handleFilterChange} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Filters */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <Filters selectedGenre={genre} onGenreChange={handleFilterChange} />
            </div>
          </div>
          
          {/* Books Grid */}
          <div className="flex-1">
            {error ? (
              <div className="text-center py-8">
                <p className="text-destructive mb-2">Failed to load books</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {isLoading 
                    ? renderSkeletons()
                    : data?.books.map(book => <BookCard key={book.id} book={book} />)
                  }
                </div>
                
                {!isLoading && data?.books.length === 0 && (
                  <div className="text-center py-12 bg-background-light rounded-lg mt-4">
                    <h3 className="text-xl font-semibold mb-2">No books found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search or filter to find what you're looking for
                    </p>
                    <Button onClick={() => {
                      setSearchTerm("");
                      setInputValue("");
                      setGenre("");
                    }}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
                
                {!isLoading && data && data.books.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination 
                      currentPage={page}
                      totalPages={data.totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
