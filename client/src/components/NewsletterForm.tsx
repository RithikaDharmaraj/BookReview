import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  preferences: z.boolean().optional(),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function NewsletterForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      preferences: false,
    },
  });
  
  const onSubmit = async (data: NewsletterFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Here you would submit to your API
      // await fetch("/api/newsletter", ...);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Thank you for subscribing!",
        description: "You'll now receive our weekly book recommendations.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <FormLabel htmlFor="email" className="text-sm font-medium text-gray-700">
                  Your Email Address
                </FormLabel>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    id="email"
                    placeholder="you@example.com"
                    className="pl-4 pr-4 py-3 rounded-lg border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs mt-1.5" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="preferences"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-2.5">
              <FormControl>
                <Checkbox
                  id="preferences"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
              </FormControl>
              <FormLabel htmlFor="preferences" className="text-sm text-gray-600 font-normal leading-relaxed">
                I'd like to receive personalized book recommendations based on my reading habits and preferences.
              </FormLabel>
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          className="w-full py-3 h-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </span>
          ) : (
            "Join our Newsletter"
          )}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          By subscribing, you agree to our <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">Terms</a> and <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors">Privacy Policy</a>.
        </p>
      </form>
    </Form>
  );
}
