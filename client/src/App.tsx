import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import BrowseBooksPage from "@/pages/BrowseBooksPage";
import BookDetailsPage from "@/pages/BookDetailsPage";
import UserProfilePage from "@/pages/UserProfilePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BookProvider } from "./context/BookContext";
import { useEffect } from "react";

function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, path?: string }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPage redirectPath={rest.path} />;
  }
  
  return <Component {...rest} />;
}

function AppRoutes() {
  const { checkAuth } = useAuth();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/browse" component={BrowseBooksPage} />
          <Route path="/books/:id">
            {params => <BookDetailsPage id={parseInt(params.id)} />}
          </Route>
          <Route path="/profile">
            <ProtectedRoute component={UserProfilePage} path="/profile" />
          </Route>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <BookProvider>
              <Toaster />
              <AppRoutes />
            </BookProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
