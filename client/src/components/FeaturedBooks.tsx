import { useEffect } from "react";
import { Link } from "wouter";
import BookCard from "./BookCard";
import { useBooks } from "@/context/BookContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedBooks() {
  const { featuredBooks, loadFeaturedBooks, isLoading } = useBooks();

  useEffect(() => {
    loadFeaturedBooks();
  }, [loadFeaturedBooks]);

  const renderSkeletons = () => {
    return Array(4).fill(0).map((_, index) => (
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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">Featured This Week</h2>
          <Link 
            href="/browse" 
            className="text-primary hover:text-primary-dark font-medium flex items-center gap-1"
          >
            View All <i className="fas fa-arrow-right text-sm"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading 
            ? renderSkeletons()
            : featuredBooks.map(book => <BookCard key={book.id} book={book} />)
          }
        </div>
      </div>
    </section>
  );
}
