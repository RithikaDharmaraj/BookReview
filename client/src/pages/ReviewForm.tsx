import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Book, reviewFormSchema } from "@shared/schema";
import AIReviewRefinement from "@/components/AIReviewRefinement";

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export default function ReviewForm() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [refinedContent, setRefinedContent] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [activeTab, setActiveTab] = useState<"original" | "refined">("original");
  
  // Fetch book details
  const { data: bookData, isLoading: isBookLoading } = useQuery<{ book: Book }>({
    queryKey: [`/api/books/${id}`],
    enabled: !!id,
  });
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title: "",
      content: "",
      rating: 5,
      bookId: parseInt(id || "0"),
      useAiRefinement: false,
    },
  });
  
  const contentWatch = form.watch("content");
  const useAiRefinementWatch = form.watch("useAiRefinement");
  
  // Submit review mutation
  const submitReview = useMutation({
    mutationFn: async (reviewData: ReviewFormValues) => {
      const finalContent = useAiRefinementWatch && refinedContent ? refinedContent : reviewData.content;
      
      const dataToSubmit = {
        ...reviewData,
        content: finalContent,
      };
      
      delete dataToSubmit.useAiRefinement;
      
      const res = await apiRequest("POST", "/api/reviews", dataToSubmit);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/books/${id}`] });
      toast({
        title: "Review submitted",
        description: "Your review has been published successfully.",
      });
      setLocation(`/books/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
      console.error("Review submission error:", error);
    },
  });
  
  // AI refinement mutation
  const refineReview = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/reviews/refine", { content });
      return res.json();
    },
    onSuccess: (data) => {
      setRefinedContent(data.refined);
      setActiveTab("refined");
      toast({
        title: "Review refined",
        description: "Your review has been refined with AI.",
      });
    },
    onError: () => {
      toast({
        title: "Refinement failed",
        description: "There was an error refining your review. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsRefining(false);
    },
  });
  
  const handleRefinement = () => {
    if (contentWatch.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write a longer review before using AI refinement.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRefining(true);
    refineReview.mutate(contentWatch);
  };
  
  const onSubmit = (data: ReviewFormValues) => {
    if (useAiRefinementWatch && !refinedContent) {
      toast({
        title: "Refinement needed",
        description: "Please refine your review with AI first or disable the AI refinement option.",
        variant: "destructive",
      });
      return;
    }
    
    submitReview.mutate(data);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to write a review.</p>
            <Button asChild>
              <a href="/login">Log In</a>
            </Button>
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
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Write a Review</h1>
            {bookData?.book && (
              <p className="text-gray-600">
                You're reviewing: <span className="font-medium">{bookData.book.title}</span> by {bookData.book.author}
              </p>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Review</CardTitle>
              <CardDescription>
                Share your thoughts about this book with the community
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Button
                                key={star}
                                type="button"
                                variant={field.value >= star ? "default" : "outline"}
                                className={`h-10 w-10 p-0 ${
                                  field.value >= star ? "bg-secondary text-secondary-foreground" : ""
                                }`}
                                onClick={() => form.setValue("rating", star)}
                              >
                                {star}
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        <FormDescription>Rate the book from 1 to 5 stars</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Summarize your thoughts" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your detailed review here..."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="useAiRefinement"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Use AI Refinement</FormLabel>
                          <FormDescription>
                            Let our AI improve your review's grammar, clarity, and style while preserving your opinions
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {useAiRefinementWatch && (
                    <div className="rounded-md border p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">AI Review Refinement</h3>
                        <Button
                          type="button"
                          onClick={handleRefinement}
                          disabled={isRefining || contentWatch.trim().length < 10}
                        >
                          {isRefining ? "Refining..." : refinedContent ? "Refine Again" : "Refine with AI"}
                        </Button>
                      </div>
                      
                      {refinedContent && (
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "original" | "refined")}>
                          <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="original">Original</TabsTrigger>
                            <TabsTrigger value="refined">Refined</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="original" className="mt-0">
                            <div className="rounded-md border p-3 bg-gray-50">
                              <p className="whitespace-pre-wrap">{contentWatch}</p>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="refined" className="mt-0">
                            <div className="rounded-md border p-3 bg-gray-50">
                              <p className="whitespace-pre-wrap">{refinedContent}</p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                      
                      {!refinedContent && !isRefining && (
                        <div className="text-sm text-gray-600">
                          <p>Write your review and click "Refine with AI" to improve the grammar, clarity, and style.</p>
                        </div>
                      )}
                      
                      {isRefining && (
                        <div className="h-24 flex items-center justify-center">
                          <div className="animate-pulse text-center">
                            <p className="text-sm text-gray-600 mb-2">Our AI is refining your review...</p>
                            <div className="h-2 bg-gray-300 rounded-full w-48 mx-auto"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setLocation(`/books/${id}`)}>
                Cancel
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={submitReview.isPending}
              >
                {submitReview.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
