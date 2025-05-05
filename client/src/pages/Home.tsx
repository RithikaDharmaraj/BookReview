import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import { BookCard } from "@/components/BookCard";
import TopRatedBookCard from "@/components/TopRatedBookCard";
import CategoryCard from "@/components/CategoryCard";
import ReviewCard from "@/components/ReviewCard";
import NewsletterForm from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { Book, Review } from "@shared/schema";

export default function Home() {
  // Fetch featured books
  const { data: featuredBooks, isLoading: isLoadingFeatured } = useQuery<Book[]>({
    queryKey: ["/api/books/featured"],
  });
  
  // Fetch top rated books
  const { data: topRatedBooksData, isLoading: isLoadingTopRated } = useQuery<{books: Book[], pagination: any}>({
    queryKey: ["/api/books", { sort: "rating", limit: 3 }],
  });
  
  // Extract the books array from the response
  const topRatedBooks = topRatedBooksData?.books || [];
  
  // Fetch recent reviews for the first book (Atomic Habits)
  const { data: recentReviews, isLoading: isLoadingReviews } = useQuery<any[]>({
    queryKey: ["/api/reviews"],
    queryFn: async () => {
      // Get reviews for the first book which has ID 1
      const response = await fetch('/api/reviews?bookId=1');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return response.json();
    },
    enabled: !isLoadingFeatured, // Only fetch reviews after featured books load
  });
  
  // Category data
  const categories = [
    { title: "Fiction", count: 842, icon: "glasses", color: "primary" },
    { title: "Science", count: 531, icon: "atom", color: "blue" },
    { title: "Psychology", count: 389, icon: "brain", color: "green" },
    { title: "Business", count: 675, icon: "chart-line", color: "yellow" },
    { title: "Romance", count: 412, icon: "heart", color: "red" },
    { title: "More", count: 1200, icon: "book-open", color: "purple" },
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Featured Books Section */}
        <section className="py-12" id="featured-books">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 pb-1">Featured Books</h2>
              <Link href="/books" className="text-primary hover:text-primary-800 font-medium flex items-center">
                View all <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoadingFeatured ? (
                Array(4).fill(0).map((_, i) => (
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
                ))
              ) : featuredBooks?.map((book) => (
                <BookCard key={book.id} book={book} averageRating={4.5} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Top Rated Books Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 pb-1">Top Rated Books</h2>
              <Link href="/books?sort=rating" className="text-primary hover:text-primary-800 font-medium flex items-center">
                View all <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingTopRated ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 flex gap-4 animate-pulse">
                    <div className="bg-gray-300 w-24 h-36 rounded-md"></div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between">
                        <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                        <div className="h-5 bg-gray-300 rounded w-1/6"></div>
                      </div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                      <div className="flex">
                        <div className="h-3 bg-gray-300 rounded w-1/4 mr-4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : topRatedBooks?.map((book) => (
                <TopRatedBookCard 
                  key={book.id} 
                  book={book} 
                  rating={4.8} 
                  reviewCount={142} 
                  readCount={2.3} 
                />
              ))}
              
              {!isLoadingTopRated && !topRatedBooks?.length && (
                <p className="text-gray-500">No top rated books available.</p>
              )}
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 pb-1 text-center">Categories</h2>
              <p className="text-gray-600 text-center mt-2">Explore books by genre and discover your next favorite read</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.title}
                  title={category.title}
                  count={category.count}
                  icon={category.icon}
                  color={category.color}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Recent Reviews Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 pb-1">Recent Reviews</h2>
              <p className="text-gray-600 mt-2">See what readers are saying about the latest books</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoadingReviews ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-gray-300 rounded-full h-12 w-12"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                      </div>
                      <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                    </div>
                    <div className="h-5 bg-gray-300 rounded w-2/3 mb-2"></div>
                    <div className="space-y-2 mb-3">
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : recentReviews?.map((review) => (
                <ReviewCard key={review.id} review={review} bookTitle={review.book?.title} />
              ))}
              
              {!isLoadingReviews && !recentReviews?.length && (
                <p className="text-gray-500">No reviews available.</p>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <Button asChild>
                <Link href="/reviews">Read More Reviews</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute top-20 right-10 w-24 h-24 rounded-full bg-white"></div>
            <div className="absolute bottom-10 left-1/4 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute -bottom-10 right-1/4 w-36 h-36 rounded-full bg-white"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                Join Our Community of Book Lovers
              </h2>
              <p className="text-indigo-100 text-lg leading-relaxed">
                Sign up today to track your reading, share reviews, and connect with fellow readers.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-xl mx-auto transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Subscribe to our newsletter</h3>
                  <p className="text-gray-500">Weekly book recommendations and updates</p>
                </div>
              </div>
              
              <NewsletterForm />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
