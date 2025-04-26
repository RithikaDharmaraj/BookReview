import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BookOpen } from "lucide-react";
import { Helmet } from "react-helmet";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

interface LoginPageProps {
  redirectPath?: string;
}

export default function LoginPage({ redirectPath = "/" }: LoginPageProps) {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  useEffect(() => {
    document.title = "BookWise - Log In";
    
    // If already authenticated, redirect
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);
  
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoginError(null);
    
    try {
      await login(values.username, values.password);
      navigate(redirectPath);
    } catch (error: any) {
      setLoginError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>BookWise - Log In</title>
        <meta name="description" content="Log in to your BookWise account to access your books, reviews, and reading lists." />
      </Helmet>
      
      <div className="min-h-screen bg-background-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-2xl font-heading font-bold text-primary">BookWise</span>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Log in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                {loginError}
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              <a 
                href="#" 
                className="text-primary hover:text-primary-dark underline underline-offset-4"
              >
                Forgot password?
              </a>
            </div>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link 
                href="/register" 
                className="text-primary hover:text-primary-dark underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
