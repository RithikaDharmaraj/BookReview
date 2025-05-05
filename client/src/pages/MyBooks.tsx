import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Book } from "@shared/schema";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BookList from "@/components/BookList";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type ReadingStatus = "reading" | "want-to-read" | "completed";

export default function MyBooks() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ReadingStatus>("reading");
  const [searchQuery, setSearchQuery] = useState("");

  // Query to fetch user's reading list
  const { data, isLoading } = useQuery<{ 
    reading: Book[], 
    wantToRead: Book[], 
    completed: Book[] 
  }>({ 
    queryKey: ["/api/users/books"],
    enabled: isAuthenticated
  });

  // Mutation to update reading status
  const updateReadingStatus = useMutation({
    mutationFn: async ({ bookId, status }: { bookId: number, status: ReadingStatus }) => {
      const res = await apiRequest("POST", "/api/users/books", { bookId, status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/books"] });
      toast({
        title: "Reading list updated",
        description: "Your reading list has been updated successfully."
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update your reading list. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Mutation to remove book from reading list
  const removeFromReadingList = useMutation({
    mutationFn: async (bookId: number) => {
      const res = await apiRequest("DELETE", `/api/users/books/${bookId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/books"] });
      toast({
        title: "Book removed",
        description: "Book has been removed from your reading list."
      });
    },
    onError: () => {
      toast({
        title: "Removal failed",
        description: "Failed to remove book from your reading list. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Filter books based on search query
  const filterBooks = (books: Book[] = []) => {
    if (!searchQuery.trim()) return books;
    
    return books.filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getActiveBooks = () => {
    if (!data) return [];
    
    switch (activeTab) {
      case "reading":
        return filterBooks(data.reading);
      case "want-to-read":
        return filterBooks(data.wantToRead);
      case "completed":
        return filterBooks(data.completed);
      default:
        return [];
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Books</h1>
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Please Log In</CardTitle>
                <CardDescription>
                  You need to be logged in to view your book collection
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" onClick={() => setLocation("/login")}>
                  Log In
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Books</h1>
              <p className="text-gray-600">
                Manage your reading journey and track your progress
              </p>
            </div>
            
            {/* Search */}
            <div className="w-full md:w-64">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search your books..."
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as ReadingStatus)}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reading">Currently Reading</TabsTrigger>
              <TabsTrigger value="want-to-read">Want to Read</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reading" className="space-y-6">
              <BookList 
                books={getActiveBooks()} 
                isLoading={isLoading}
                emptyMessage="You don't have any books in your currently reading list"
              />
            </TabsContent>
            
            <TabsContent value="want-to-read" className="space-y-6">
              <BookList 
                books={getActiveBooks()} 
                isLoading={isLoading}
                emptyMessage="You don't have any books in your want to read list"
              />
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-6">
              <BookList 
                books={getActiveBooks()} 
                isLoading={isLoading}
                emptyMessage="You haven't completed any books yet"
              />
            </TabsContent>
          </Tabs>
          
          {/* Reading Suggestions */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended For You</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Based on your interests</CardTitle>
                  <CardDescription>
                    Books similar to what you've enjoyed before
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                    <p className="text-gray-500">Personalized recommendations coming soon</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setLocation("/books")}>
                    Explore Books
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Popular This Month</CardTitle>
                  <CardDescription>
                    Trending books among our community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                    <p className="text-gray-500">Trending books coming soon</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setLocation("/books")}>
                    View Popular Books
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Reading Challenges</CardTitle>
                  <CardDescription>
                    Challenge yourself to read more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                    <p className="text-gray-500">Reading challenges coming soon</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled>
                    Join a Challenge
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
