import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { getUserReviews } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  UserIcon, 
  BookIcon, 
  StarIcon, 
  TrophyIcon, 
  SettingsIcon,
  PencilIcon,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";

export default function UserProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    avatar: user?.avatar || ""
  });
  
  const { data: userReviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: [user ? `/api/reviews/user/${user.id}` : null],
    queryFn: () => getUserReviews(user!.id),
    enabled: !!user,
  });
  
  useEffect(() => {
    document.title = "BookWise - My Profile";
  }, []);
  
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        bio: user.bio || "",
        avatar: user.avatar || ""
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive"
      });
    }
  };
  
  // Mock data for reading challenges
  const readingChallengeData = {
    targetBooks: 50,
    completedBooks: 12,
    progressPercentage: 24,
    streakDays: 42,
    booksThisMonth: 3
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-6">Please log in to view your profile</p>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BookWise - My Profile</title>
        <meta name="description" content="View and manage your BookWise profile, reviews, and reading progress." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm">
          <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
          <ChevronRight className="text-gray-400 mx-2 h-4 w-4" />
          <span className="text-gray-900">My Profile</span>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow overflow-hidden sticky top-24">
              <div className="bg-primary p-6 text-white">
                <div className="flex items-center mb-4">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold">{user.fullName || user.username}</h2>
                    <p className="text-primary-foreground opacity-90">@{user.username}</p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="mb-1">Joined: May 2023</p>
                  <p>Reviews: {userReviews?.length || 0}</p>
                </div>
              </div>
              
              <div className="p-4">
                <Tabs value={activeTab}>
                  <TabsList className="grid w-full grid-cols-1 h-auto bg-muted rounded-md">
                    <TabsTrigger 
                      value="profile" 
                      onClick={() => setActiveTab("profile")}
                      className={`flex items-center justify-start px-4 py-2 ${activeTab === "profile" ? "bg-white shadow" : ""}`}
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger 
                      value="books" 
                      onClick={() => setActiveTab("books")}
                      className={`flex items-center justify-start px-4 py-2 ${activeTab === "books" ? "bg-white shadow" : ""}`}
                    >
                      <BookIcon className="mr-2 h-4 w-4" />
                      My Books
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reviews" 
                      onClick={() => setActiveTab("reviews")}
                      className={`flex items-center justify-start px-4 py-2 ${activeTab === "reviews" ? "bg-white shadow" : ""}`}
                    >
                      <StarIcon className="mr-2 h-4 w-4" />
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger 
                      value="challenge" 
                      onClick={() => setActiveTab("challenge")}
                      className={`flex items-center justify-start px-4 py-2 ${activeTab === "challenge" ? "bg-white shadow" : ""}`}
                    >
                      <TrophyIcon className="mr-2 h-4 w-4" />
                      Reading Challenge
                    </TabsTrigger>
                    <TabsTrigger 
                      value="settings" 
                      onClick={() => setActiveTab("settings")}
                      className={`flex items-center justify-start px-4 py-2 ${activeTab === "settings" ? "bg-white shadow" : ""}`}
                    >
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="profile" className="mt-0">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-heading font-bold">Profile Information</h2>
                    {!isEditing && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center"
                      >
                        <PencilIcon className="mr-1 h-4 w-4" /> Edit
                      </Button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <Input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Avatar URL</label>
                        <Input
                          name="avatar"
                          value={formData.avatar}
                          onChange={handleInputChange}
                          placeholder="URL to your avatar image"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <Textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself"
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              fullName: user.fullName || "",
                              bio: user.bio || "",
                              avatar: user.avatar || ""
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Username</h3>
                        <p className="mt-1">@{user.username}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p className="mt-1">{user.fullName || "Not set"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                        <p className="mt-1">{user.bio || "No bio available"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="books" className="mt-0">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-heading font-bold mb-6">My Books</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Reading Now</h3>
                      <div className="text-center py-8 bg-background-light rounded-lg">
                        <p className="text-gray-500 mb-4">You're not reading any books right now</p>
                        <Button asChild>
                          <Link href="/browse">Find Books to Read</Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Want to Read</h3>
                      <div className="text-center py-8 bg-background-light rounded-lg">
                        <p className="text-gray-500 mb-4">Your reading list is empty</p>
                        <Button asChild>
                          <Link href="/browse">Browse Books</Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Read</h3>
                      <div className="text-center py-8 bg-background-light rounded-lg">
                        <p className="text-gray-500 mb-4">You haven't marked any books as read</p>
                        <Button asChild>
                          <Link href="/browse">Discover Books</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-heading font-bold mb-6">My Reviews</h2>
                  
                  {isLoadingReviews ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <div className="flex">
                              <Skeleton className="h-16 w-12 mr-4" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : userReviews && userReviews.length > 0 ? (
                    <div className="space-y-4">
                      {userReviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex">
                              <Link href={`/books/${review.bookId}`}>
                                <img 
                                  src={review.book?.coverImage} 
                                  alt={review.book?.title} 
                                  className="h-20 w-14 object-cover rounded mr-4"
                                />
                              </Link>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <Link 
                                    href={`/books/${review.bookId}`}
                                    className="font-semibold text-primary hover:underline"
                                  >
                                    {review.book?.title}
                                  </Link>
                                  <div className="flex items-center">
                                    {Array(5).fill(0).map((_, i) => (
                                      <StarIcon 
                                        key={i} 
                                        className={`h-4 w-4 ${i < Math.floor(review.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  by {review.book?.author} • {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-700 line-clamp-2">{review.content}</p>
                                <div className="mt-2 text-xs text-gray-500">
                                  {review.likesCount} likes
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-background-light rounded-lg">
                      <p className="text-gray-500 mb-4">You haven't written any reviews yet</p>
                      <Button asChild>
                        <Link href="/browse">Find Books to Review</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="challenge" className="mt-0">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-heading font-bold mb-6">Reading Challenge</h2>
                  
                  <div className="bg-background-light p-6 rounded-lg mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Your 2025 Challenge:</span>
                      <span className="text-accent font-bold">
                        {readingChallengeData.completedBooks} of {readingChallengeData.targetBooks} books
                      </span>
                    </div>
                    <Progress 
                      value={readingChallengeData.progressPercentage} 
                      className="h-3 mb-4"
                    />
                    <p className="text-sm text-gray-600">
                      You're {readingChallengeData.completedBooks > 10 ? "ahead of" : "behind"} schedule! Keep it up!
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-secondary text-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-accent mb-1">
                        {readingChallengeData.streakDays}
                      </div>
                      <div className="text-sm">Days Streak</div>
                    </div>
                    <div className="bg-secondary text-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-accent mb-1">
                        {readingChallengeData.completedBooks}
                      </div>
                      <div className="text-sm">Books This Year</div>
                    </div>
                    <div className="bg-secondary text-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-accent mb-1">
                        {readingChallengeData.booksThisMonth}
                      </div>
                      <div className="text-sm">Books This Month</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    
                    <div className="text-center py-8 bg-background-light rounded-lg">
                      <p className="text-gray-500 mb-4">No recent activity</p>
                      <Button asChild>
                        <Link href="/browse">Find Your Next Book</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-heading font-bold mb-6">Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                      <p className="text-gray-600 mb-4">
                        Manage your account settings and preferences
                      </p>
                      <Button disabled>Change Password</Button>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                      <p className="text-gray-600 mb-4">
                        Manage how and when you receive notifications from BookWise
                      </p>
                      <Button disabled>Notification Settings</Button>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                      <p className="text-gray-600 mb-4">
                        Control your privacy settings and who can see your activity
                      </p>
                      <Button disabled>Privacy Settings</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
