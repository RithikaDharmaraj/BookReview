import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Review, Book } from "@shared/schema";
import { ReviewCard } from "@/components/ReviewCard";
import { BookCard } from "@/components/BookCard";

export default function UserProfile() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    profileImage: "",
  });

  // Fetch user data and reviews
  const { data, isLoading } = useQuery<{ user: User; reviews: Review[] }>({    
    queryKey: [user ? `/api/users/${user.id}` : null],
    enabled: !!user,
  });

  // Fetch user's reading lists
  const { data: userBooksData, isLoading: userBooksLoading } = useQuery<{ 
    reading: Book[], 
    wantToRead: Book[], 
    completed: Book[] 
  }>({ 
    queryKey: ["/api/users/books"],
    enabled: !!user
  });

  // Update user mutation
  const updateUser = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const res = await apiRequest("PUT", `/api/users/${user?.id}`, userData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser.mutate(formData);
  };

  // Start editing mode
  const handleEdit = () => {
    if (data?.user) {
      setFormData({
        name: data.user.name,
        email: data.user.email,
        bio: data.user.bio || "",
        profileImage: data.user.profileImage || "",
      });
      setIsEditing(true);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (authLoading || (isLoading && user)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-16 bg-gray-300 rounded w-1/3"></div>
              <div className="h-48 bg-gray-300 rounded"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine the correct reading statistics
  const readingCount = userBooksData?.reading.length || 0;
  const completedCount = userBooksData?.completed.length || 0;
  const wantToReadCount = userBooksData?.wantToRead.length || 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal details</CardDescription>
                </CardHeader>
                
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Profile Image URL</label>
                        <Input
                          name="profileImage"
                          value={formData.profileImage}
                          onChange={handleChange}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <Textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Tell us about yourself"
                          rows={4}
                        />
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center mb-6">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={data?.user.profileImage || undefined} alt={data?.user.name || 'User'} />
                          <AvatarFallback className="text-lg">
                            {data?.user.name ? data.user.name.split(" ").map(n => n[0]).join("") : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900">{data?.user.name}</h3>
                        <p className="text-gray-500 text-sm">@{data?.user.username}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Email</h4>
                        <p className="text-gray-600">{data?.user.email}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Bio</h4>
                        <p className="text-gray-600">{data?.user.bio || "No bio provided"}</p>
                      </div>
                      
                      <div className="pt-2">
                        <h4 className="text-sm font-medium text-gray-700">Account Stats</h4>
                        <div className="flex justify-between mt-2 text-sm">
                          <div className="text-center">
                            <p className="font-bold text-primary">{data?.reviews.length || 0}</p>
                            <p className="text-gray-500">Reviews</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-primary">{completedCount}</p>
                            <p className="text-gray-500">Books Read</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-primary">{readingCount + wantToReadCount}</p>
                            <p className="text-gray-500">Reading List</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-end">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={updateUser.isPending}
                      >
                        {updateUser.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleEdit}>Edit Profile</Button>
                  )}
                </CardFooter>
              </Card>
            </div>
            
            {/* Activity Tabs */}
            <div className="md:col-span-2">
              <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="reviews">My Reviews</TabsTrigger>
                  <TabsTrigger value="reading">Reading List</TabsTrigger>
                  <TabsTrigger value="completed">Completed Books</TabsTrigger>
                </TabsList>
                
                <TabsContent value="reviews">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">Your Reviews</h2>
                      <Button asChild>
                        <Link href="/books">Find Books to Review</Link>
                      </Button>
                    </div>
                    
                    {data?.reviews && data.reviews.length > 0 ? (
                      data.reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))
                    ) : (
                      <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">You haven't written any reviews yet.</p>
                        <Button asChild>
                          <Link href="/books">Browse Books</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="reading">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">Your Reading List</h2>
                      <Button asChild>
                        <Link href="/books">Add Books</Link>
                      </Button>
                    </div>
                    
                    {userBooksLoading ? (
                      <div className="animate-pulse space-y-6">
                        <div className="h-48 bg-gray-300 rounded"></div>
                        <div className="h-48 bg-gray-300 rounded"></div>
                      </div>
                    ) : userBooksData?.reading && userBooksData.reading.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userBooksData.reading.map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">Your reading list is empty.</p>
                        <Button asChild>
                          <Link href="/books">Browse Books</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">Completed Books</h2>
                      <Button variant="outline">View Reading Stats</Button>
                    </div>
                    
                    {userBooksLoading ? (
                      <div className="animate-pulse space-y-6">
                        <div className="h-48 bg-gray-300 rounded"></div>
                        <div className="h-48 bg-gray-300 rounded"></div>
                      </div>
                    ) : userBooksData?.completed && userBooksData.completed.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userBooksData.completed.map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">You haven't marked any books as completed.</p>
                        <Button asChild>
                          <Link href="/books">Browse Books</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
