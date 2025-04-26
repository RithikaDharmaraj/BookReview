import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Camera, WandSparkles } from "lucide-react";
import StarRating from "./StarRating";
import { addReview, refineReview } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

const reviewSchema = z.object({
  content: z.string().min(10, "Review must be at least 10 characters"),
  rating: z.number().min(1, "Please provide a rating").max(5),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  bookId: number;
}

export default function ReviewForm({ bookId }: ReviewFormProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [refinedContent, setRefinedContent] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [activeTab, setActiveTab] = useState("original");
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      content: "",
      rating: 0,
    },
  });
  
  const onSubmit = async (data: ReviewFormValues) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const content = activeTab === "refined" && refinedContent ? refinedContent : data.content;
      
      await addReview({
        userId: user.id,
        bookId,
        content,
        rating: data.rating,
        aiEnhanced: activeTab === "refined" ? data.content : undefined,
      });
      
      // Reset form
      form.reset();
      setRefinedContent("");
      setActiveTab("original");
      
      // Invalidate reviews cache
      queryClient.invalidateQueries({ queryKey: [`/api/reviews?bookId=${bookId}`] });
      
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your thoughts!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRatingChange = (value: number) => {
    form.setValue("rating", value);
  };
  
  const handleRefine = async () => {
    const content = form.getValues("content");
    
    if (content.length < 10) {
      toast({
        title: "Content too short",
        description: "Please write at least 10 characters before refining",
        variant: "destructive",
      });
      return;
    }
    
    setIsRefining(true);
    
    try {
      const { refined } = await refineReview(content);
      setRefinedContent(refined);
      setActiveTab("refined");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refine review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please <Button variant="link" className="p-0" asChild><a href="/login">log in</a></Button> to write a review
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-gray-900">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center mb-4">
              <FormLabel className="text-gray-700 mr-3">Your Rating:</FormLabel>
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <StarRating
                        initialRating={field.value}
                        onChange={handleRatingChange}
                        size="lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="original">Original</TabsTrigger>
                <TabsTrigger 
                  value="refined" 
                  disabled={!refinedContent}
                >
                  AI Refined
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="original" className="mt-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Share your thoughts on this book..."
                          className="resize-none min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="refined" className="mt-2">
                {refinedContent ? (
                  <Textarea
                    value={refinedContent}
                    onChange={(e) => setRefinedContent(e.target.value)}
                    className="resize-none min-h-24"
                  />
                ) : (
                  <div className="h-24 border rounded-md flex items-center justify-center text-muted-foreground">
                    Use the "Refine with AI" button to enhance your review
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                >
                  <Camera className="mr-1 h-4 w-4" /> Add Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={handleRefine}
                  disabled={form.getValues("content").length < 10 || isRefining}
                >
                  <WandSparkles className="mr-1 h-4 w-4" /> 
                  {isRefining ? "Refining..." : "Refine with AI"}
                </Button>
              </div>
              
              <Button type="submit">Post Review</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
