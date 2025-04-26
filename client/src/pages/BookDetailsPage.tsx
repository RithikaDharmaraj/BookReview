import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getBook, getReviews } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { StarIcon, BookmarkIcon, MoreHorizontalIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet";

interface BookDetailsPageProps {
  id: number;
}

export default function BookDetailsPage({ id }: BookDetailsPageProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState("reviews");
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const { data: book, isLoading: isLoadingBook, error: bookError } = useQuery({
    queryKey: [`/api/books/${id}`],
    queryFn: () => getBook(id),
  });
  
  const { data: reviewsData } = useQuery({
    queryKey: [`/api/reviews?bookId=${id}&page=1&limit=1`],
    queryFn: () => getReviews(id, 1, 1),
    enabled: !!id,
  });
  
  useEffect(() => {
    if (book) {
      document.title = `BookWise - ${book.title} by ${book.author}`;
    }
  }, [book]);
  
  const addToReadingList = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add books to your reading list",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Added to list",
      description: `${book?.title} has been added to your reading list`,
    });
  };
  
  // Format ratings data
  const ratingsData = [
    { stars: 5, percentage: 65 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 }
  ];
  
  const averageRating = (5 * ratingsData[0].percentage + 4 * ratingsData[1].percentage + 
                         3 * ratingsData[2].percentage + 2 * ratingsData[3].percentage + 
                         1 * ratingsData[4].percentage) / 100;
  
  const totalReviews = reviewsData?.total || 0;
  
  if (bookError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Book</h2>
        <p className="text-gray-600 mb-6">We couldn't find the book you're looking for.</p>
        <Button asChild>
          <Link href="/browse">Browse Books</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{book ? `BookWise - ${book.title} by ${book.author}` : "BookWise - Book Details"}</title>
        <meta name="description" content={book?.description || "View book details, read reviews, and share your thoughts."} />
      </Helmet>
      
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
            <ChevronRightIcon className="text-gray-400 mx-2 h-4 w-4" />
            <Link href="/browse" className="text-gray-500 hover:text-primary">Browse</Link>
            {!isLoadingBook && book?.genres && book.genres[0] && (
              <>
                <ChevronRightIcon className="text-gray-400 mx-2 h-4 w-4" />
                <Link 
                  href={`/browse?genre=${encodeURIComponent(book.genres[0])}`}
                  className="text-gray-500 hover:text-primary"
                >
                  {book.genres[0]}
                </Link>
              </>
            )}
            <ChevronRightIcon className="text-gray-400 mx-2 h-4 w-4" />
            <span className="text-gray-900">
              {isLoadingBook ? "Loading..." : book?.title}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Book Cover and Info */}
            <div className="md:w-1/3 lg:w-1/4 flex flex-col items-center mb-8 md:mb-0">
              {isLoadingBook ? (
                <Skeleton className="w-48 md:w-full max-w-xs h-72 md:h-96 rounded-lg mb-6" />
              ) : (
                <div className="w-48 md:w-full max-w-xs mb-6">
                  <img 
                    src={book?.coverImage} 
                    alt={`${book?.title} book cover`} 
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
              
              <div className="flex justify-center space-x-3 mb-6">
                <Button 
                  onClick={addToReadingList}
                  className="bg-primary hover:bg-primary-dark text-white font-medium transition-all flex items-center"
                >
                  <BookmarkIcon className="mr-2 h-4 w-4" /> Want to Read
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-background-light rounded-lg p-4 w-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">Ratings</span>
                  <div className="flex text-yellow-400">
                    {Array(5).fill(0).map((_, index) => (
                      <StarIcon 
                        key={index} 
                        className={`h-4 w-4 ${index < Math.floor(averageRating) ? "fill-current" : index < averageRating ? "fill-current" : "fill-none"}`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {ratingsData.map((rating) => (
                    <div key={rating.stars} className="flex items-center">
                      <span className="text-xs w-8">{rating.stars} ★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{rating.percentage}%</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-center mt-3 text-gray-600">
                  {averageRating.toFixed(1)} average from {totalReviews} reviews
                </div>
              </div>
            </div>
            
            {/* Book Details */}
            <div className="md:w-2/3 lg:w-3/4 md:pl-8">
              {isLoadingBook ? (
                <>
                  <Skeleton className="h-10 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                </>
              ) : (
                <>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
                    {book?.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    By <a href="#" className="text-primary hover:underline">{book?.author}</a>
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {book?.genres?.map((genre, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-700">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {showFullDescription 
                        ? book?.description 
                        : `${book?.description.substring(0, 300)}${book?.description.length > 300 ? '...' : ''}`
                      }
                    </p>
                    {book?.description.length > 300 && (
                      <Button 
                        variant="link" 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-primary hover:text-primary-dark font-medium p-0"
                      >
                        {showFullDescription ? 'Read less' : 'Read more'} 
                        {showFullDescription 
                          ? <ChevronDownIcon className="ml-1 h-4 w-4" /> 
                          : <ChevronRightIcon className="ml-1 h-4 w-4" />
                        }
                      </Button>
                    )}
                  </div>
                  
                  {/* Additional book details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 text-sm">
                    {book?.publisher && (
                      <div>
                        <span className="font-medium text-gray-700">Publisher:</span>
                        <p>{book.publisher}</p>
                      </div>
                    )}
                    {book?.publishedDate && (
                      <div>
                        <span className="font-medium text-gray-700">Published:</span>
                        <p>{new Date(book.publishedDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {book?.pages && (
                      <div>
                        <span className="font-medium text-gray-700">Pages:</span>
                        <p>{book.pages}</p>
                      </div>
                    )}
                    {book?.language && (
                      <div>
                        <span className="font-medium text-gray-700">Language:</span>
                        <p>{book.language}</p>
                      </div>
                    )}
                    {book?.isbn && (
                      <div>
                        <span className="font-medium text-gray-700">ISBN:</span>
                        <p>{book.isbn}</p>
                      </div>
                    )}
                    {book?.price && (
                      <div>
                        <span className="font-medium text-gray-700">Price:</span>
                        <p>${book.price.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 border-b border-gray-200 w-full justify-start rounded-none bg-transparent">
                  <TabsTrigger 
                    value="reviews" 
                    className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-4 py-2"
                  >
                    Reviews ({totalReviews})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="quotes" 
                    className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-4 py-2"
                  >
                    Quotes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="details" 
                    className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-4 py-2"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="similar" 
                    className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-4 py-2"
                  >
                    Similar Books
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="reviews" className="pt-2">
                  {/* Review Form */}
                  <div className="mb-8">
                    <ReviewForm bookId={id} />
                  </div>
                  
                  {/* Reviews List */}
                  <ReviewList bookId={id} />
                </TabsContent>
                
                <TabsContent value="quotes">
                  <div className="py-4 text-center text-gray-500">
                    No quotes available for this book yet.
                  </div>
                </TabsContent>
                
                <TabsContent value="details">
                  <div className="py-4">
                    <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">Book Details</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-background-light p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Publication Details</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span className="text-gray-600">Title:</span>
                              <span className="font-medium">{book?.title}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Author:</span>
                              <span className="font-medium">{book?.author}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Publisher:</span>
                              <span className="font-medium">{book?.publisher}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Publication Date:</span>
                              <span className="font-medium">{book?.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : 'Unknown'}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Language:</span>
                              <span className="font-medium">{book?.language}</span>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-background-light p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Book Information</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span className="text-gray-600">ISBN:</span>
                              <span className="font-medium">{book?.isbn}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Pages:</span>
                              <span className="font-medium">{book?.pages}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Genres:</span>
                              <span className="font-medium">{book?.genres?.join(', ')}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-medium">${book?.price?.toFixed(2)}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Featured:</span>
                              <span className="font-medium">{book?.featured ? 'Yes' : 'No'}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="similar">
                  <div className="py-4 text-center text-gray-500">
                    Similar books will appear here.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
