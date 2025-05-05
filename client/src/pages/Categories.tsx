import { useState } from "react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Categories() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  
  // Category data
  const categories = [
    { title: "Fiction", count: 842, icon: "book", color: "primary" },
    { title: "Non-Fiction", count: 567, icon: "file-text", color: "indigo" },
    { title: "Science", count: 531, icon: "atom", color: "blue" },
    { title: "Psychology", count: 389, icon: "brain", color: "green" },
    { title: "Business", count: 675, icon: "chart-line", color: "yellow" },
    { title: "Romance", count: 412, icon: "heart", color: "red" },
    { title: "Fantasy", count: 328, icon: "wand", color: "purple" },
    { title: "Thriller", count: 295, icon: "lightning", color: "orange" },
    { title: "Mystery", count: 276, icon: "search", color: "teal" },
    { title: "Biography", count: 198, icon: "user", color: "pink" },
    { title: "History", count: 243, icon: "landmark", color: "gray" },
    { title: "Self-Help", count: 421, icon: "star", color: "cyan" },
  ];
  
  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const navigateToCategory = (category: string) => {
    setLocation(`/books?category=${category.toLowerCase()}`);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Categories</h1>
            <p className="text-gray-600">Browse books by genre and discover your next favorite read</p>
          </div>
          
          {/* Search */}
          <div className="mb-8 max-w-md">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search categories..."
                className="pl-10 pr-4 py-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div 
                key={category.title}
                onClick={() => navigateToCategory(category.title)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <CategoryCard
                  title={category.title}
                  count={category.count}
                  icon={category.icon}
                  color={category.color}
                />
              </div>
            ))}
          </div>
          
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-gray-900 mb-2">No categories found</h2>
              <p className="text-gray-600 mb-6">Try adjusting your search term</p>
              <Button variant="outline" onClick={() => setSearch("")}>Clear Search</Button>
            </div>
          )}
          
          {/* Popular Genres Section */}
          <section className="mt-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Genres</h2>
              <p className="text-gray-600">The most trending book categories right now</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-primary-600 to-primary-400 flex items-center justify-center">
                  <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Fiction</h3>
                  <p className="text-gray-600 mb-4">Escape into worlds of imagination with our bestselling fiction titles</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigateToCategory("Fiction")}
                  >
                    Browse Fiction
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center">
                  <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Self-Help</h3>
                  <p className="text-gray-600 mb-4">Transform your life with our curated collection of self-improvement books</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigateToCategory("Self-Help")}
                  >
                    Browse Self-Help
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                  <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Science</h3>
                  <p className="text-gray-600 mb-4">Explore the wonders of our universe with our science book collection</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigateToCategory("Science")}
                  >
                    Browse Science
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
