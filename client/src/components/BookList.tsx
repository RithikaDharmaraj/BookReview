import { Book } from "@shared/schema";
import BookCard from "@/components/BookCard";

interface BookListProps {
  books: Book[];
  isLoading: boolean;
  averageRating?: number;
  emptyMessage?: string;
}

export default function BookList({ books, isLoading, averageRating = 4.5, emptyMessage = "No books found" }: BookListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
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
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} averageRating={averageRating} />
      ))}
    </div>
  );
}
