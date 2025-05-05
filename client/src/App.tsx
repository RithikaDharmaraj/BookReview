import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/AuthContext";
import Home from "@/pages/Home";
import BookListing from "@/pages/BookListing";
import BookDetail from "@/pages/BookDetail";
import UserProfile from "@/pages/UserProfile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ReviewForm from "@/pages/ReviewForm";
import NotFound from "@/pages/not-found";
import Categories from "@/pages/Categories";
import About from "@/pages/About";
import MyBooks from "@/pages/MyBooks";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/books" component={BookListing} />
      <Route path="/books/:id" component={BookDetail} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/books/:id/review" component={ReviewForm} />
      <Route path="/categories" component={Categories} />
      <Route path="/about" component={About} />
      <Route path="/my-books" component={MyBooks} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
