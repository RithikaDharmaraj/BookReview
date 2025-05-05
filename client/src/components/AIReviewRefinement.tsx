import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface AIReviewRefinementProps {
  originalContent: string;
  onRefinementComplete: (refinedContent: string) => void;
}

export default function AIReviewRefinement({ 
  originalContent, 
  onRefinementComplete 
}: AIReviewRefinementProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"original" | "refined">("original");
  const [refinedContent, setRefinedContent] = useState<string | null>(null);
  
  const refineReview = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/reviews/refine", { content });
      return res.json();
    },
    onSuccess: (data) => {
      setRefinedContent(data.refined);
      setActiveTab("refined");
      onRefinementComplete(data.refined);
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
  });
  
  const handleRefinement = () => {
    if (originalContent.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write a longer review before using AI refinement.",
        variant: "destructive",
      });
      return;
    }
    
    refineReview.mutate(originalContent);
  };
  
  return (
    <div className="rounded-md border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">AI Review Refinement</h3>
        <Button
          type="button"
          onClick={handleRefinement}
          disabled={refineReview.isPending || originalContent.trim().length < 10}
        >
          {refineReview.isPending ? "Refining..." : refinedContent ? "Refine Again" : "Refine with AI"}
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
              <p className="whitespace-pre-wrap">{originalContent}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="refined" className="mt-0">
            <div className="rounded-md border p-3 bg-gray-50">
              <p className="whitespace-pre-wrap">{refinedContent}</p>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      {!refinedContent && !refineReview.isPending && (
        <div className="text-sm text-gray-600">
          <p>Click "Refine with AI" to improve the grammar, clarity, and style of your review while preserving your opinions.</p>
        </div>
      )}
      
      {refineReview.isPending && (
        <div className="h-24 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="text-sm text-gray-600 mb-2">Our AI is refining your review...</p>
            <div className="h-2 bg-gray-300 rounded-full w-48 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
}
