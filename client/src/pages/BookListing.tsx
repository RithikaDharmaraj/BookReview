import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Book } from "@shared/schema";
import { Filter, SortAsc, SortDesc } from "lucide-react";

export default function BookListing() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [category, setCategory] = useState<string | null>(searchParams.get("category"));
  const [search, setSearch] = useState<string | null>(searchParams.get("search"));
  const [sort, setSort] = useState<string>(searchParams.get("sort") || "title");
  const [order, setOrder] = useState<"asc" | "desc">(
    (searchParams.get("order") as "asc" | "desc") || "asc"
  );
  const [showFilters, setShowFilters] = useState(false);
  
  // Build the query params for the API request
  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  queryParams.set("limit", "12");
  if (category) queryParams.set("category", category);
  if (search) queryParams.set("search", search);
  queryParams.set("sort", sort);
  queryParams.set("order", order);
  
  // Fetch books with query params
  const { data, isLoading } = useQuery<{
    books: Book[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>({
    queryKey: [`/api/books?${queryParams.toString()}`],
  });
  
  const books = data?.books || [];
  const pagination = data?.pagination;
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(location.split("?")[1] || "");
    params.set("page", newPage.toString());
    setLocation(`/books?${params.toString()}`);
  };
  
  // Handle category filter
  const handleCategoryChange = (value: string) => {
    const newCategory = value === "all" ? null : value;
    setCategory(newCategory);
    setPage(1);
    
    const params = new URLSearchParams(location.split("?")[1] || "");
    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    setLocation(`/books?${params.toString()}`);
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSort(value);
    const params = new URLSearchParams(location.split("?")[1] || "");
    params.set("sort", value);
    setLocation(`/books?${params.toString()}`);
  };
  
  // Handle order change
  const handleOrderChange = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    const params = new URLSearchParams(location.split("?")[1] || "");
    params.set("order", newOrder);
    setLocation(`/books?${params.toString()}`);
  };
  
  // Category options
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "fiction", label: "Fiction" },
    { value: "non-fiction", label: "Non-Fiction" },
    { value: "science", label: "Science" },
    { value: "psychology", label: "Psychology" },
    { value: "business", label: "Business" },
    { value: "romance", label: "Romance" },
    { value: "fantasy", label: "Fantasy" },
    { value: "thriller", label: "Thriller" },
    { value: "mystery", label: "Mystery" },
    { value: "biography", label: "Biography" },
    { value: "history", label: "History" },
    { value: "self-help", label: "Self-Help" },
  ];
  
  // Sort options
  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "author", label: "Author" },
    { value: "rating", label: "Rating" },
    { value: "price", label: "Price" },
    { value: "date", label: "Publication Date" },
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Books</h1>
            <p className="text-gray-600">Discover your next favorite read from our collection</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Search */}
            <div className="w-full md:w-1/2 lg:w-2/3">
              <SearchBar 
                className="w-full" 
                placeholder="Search by title, author, or description..." 
                defaultValue={search || ""}
                onSearch={(query) => {
                  setSearch(query);
                  setPage(1);
                  const params = new URLSearchParams(location.split("?")[1] || "");
                  params.set("search", query);
                  params.set("page", "1");
                  setLocation(`/books?${params.toString()}`);
                }}
              />
            </div>
            
            <div className="w-full md:w-1/2 lg:w-1/3 flex space-x-2">
              {/* Sort */}
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Order toggle */}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleOrderChange}
                title={order === "asc" ? "Ascending" : "Descending"}
              >
                {order === "asc" ? <SortAsc /> : <SortDesc />}
              </Button>
              
              {/* Mobile filter toggle */}
              <Button 
                variant="outline" 
                size="icon" 
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters sidebar - desktop */}
            <div className="hidden md:block w-64 shrink-0">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Category</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div key={cat.value} className="flex items-center">
                        <Checkbox 
                          id={`category-${cat.value}`}
                          checked={cat.value === "all" ? !category : category === cat.value}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleCategoryChange(cat.value);
                            } else if (category === cat.value) {
                              handleCategoryChange("all");
                            }
                          }}
                        />
                        <label 
                          htmlFor={`category-${cat.value}`}
                          className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {cat.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="price-under10" />
                      <label 
                        htmlFor="price-under10"
                        className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Under ₹835
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="price-10to20" />
                      <label 
                        htmlFor="price-10to20"
                        className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        ₹835 - ₹1670
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="price-over20" />
                      <label 
                        htmlFor="price-over20"
                        className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Over ₹1670
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Ratings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="rating-4plus" />
                      <label 
                        htmlFor="rating-4plus"
                        className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        4★ & above
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="rating-3plus" />
                      <label 
                        htmlFor="rating-3plus"
                        className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        3★ & above
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="rating-all" />
                      <label 
                        htmlFor="rating-all"
                        className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        All ratings
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filters - mobile */}
            {showFilters && (
              <div className="md:hidden bg-white p-4 rounded-lg shadow mb-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="category">
                    <AccordionTrigger className="font-medium">Category</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {categories.map((cat) => (
                          <div key={cat.value} className="flex items-center">
                            <Checkbox 
                              id={`m-category-${cat.value}`}
                              checked={cat.value === "all" ? !category : category === cat.value}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleCategoryChange(cat.value);
                                } else if (category === cat.value) {
                                  handleCategoryChange("all");
                                }
                              }}
                            />
                            <label 
                              htmlFor={`m-category-${cat.value}`}
                              className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              {cat.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="price">
                    <AccordionTrigger className="font-medium">Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center">
                          <Checkbox id="m-price-under10" />
                          <label 
                            htmlFor="m-price-under10"
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            Under ₹835
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox id="m-price-10to20" />
                          <label 
                            htmlFor="m-price-10to20"
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            ₹835 - ₹1670
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox id="m-price-over20" />
                          <label 
                            htmlFor="m-price-over20"
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            Over ₹1670
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="ratings">
                    <AccordionTrigger className="font-medium">Ratings</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center">
                          <Checkbox id="m-rating-4plus" />
                          <label 
                            htmlFor="m-rating-4plus"
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            4★ & above
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox id="m-rating-3plus" />
                          <label 
                            htmlFor="m-rating-3plus"
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            3★ & above
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox id="m-rating-all" />
                          <label 
                            htmlFor="m-rating-all"
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            All ratings
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            
            {/* Book grid */}
            <div className="flex-1">
              {search && (
                <div className="mb-4">
                  <p className="text-gray-600">
                    Search results for: <span className="font-medium text-primary">{search}</span>
                  </p>
                </div>
              )}
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(12).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden shadow h-[400px] animate-pulse">
                      <div className="bg-gray-300 h-56 w-full"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="flex justify-between">
                          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} averageRating={4.5} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No books found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                  <Button onClick={() => {
                    setCategory(null);
                    setSearch(null);
                    setPage(1);
                    setLocation("/books");
                  }}>
                    Clear all filters
                  </Button>
                </div>
              )}
              
              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, page - 1))}
                          className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        // Calculate page numbers to show based on current page
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNum)}
                              isActive={pageNum === page}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {pagination.totalPages > 5 && page < pagination.totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      {pagination.totalPages > 5 && page < pagination.totalPages - 2 && (
                        <PaginationItem>
                          <PaginationLink onClick={() => handlePageChange(pagination.totalPages)}>
                            {pagination.totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(pagination.totalPages, page + 1))}
                          className={page >= pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
