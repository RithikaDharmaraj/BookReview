import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

type User = {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  checkAuth: () => void;
};

type RegisterData = {
  username: string;
  password: string;
  email: string;
  fullName?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Check if user is already logged in (from localStorage)
  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem("user");
      }
    }
  }, []);
  
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("POST", "/api/login", { username, password });
      const userData = await response.json();
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`
      });
      
      // Invalidate queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    } catch (err: any) {
      const errorMsg = err.message || "Login failed. Please try again.";
      setError(errorMsg);
      
      toast({
        title: "Login failed",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("POST", "/api/register", userData);
      const newUser = await response.json();
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to BookWise, ${newUser.username}!`
      });
      
      // Invalidate queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    } catch (err: any) {
      const errorMsg = err.message || "Registration failed. Please try again.";
      setError(errorMsg);
      
      toast({
        title: "Registration failed",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    
    // Invalidate queries that might depend on auth state
    queryClient.invalidateQueries({ queryKey: ["/api/users"] });
  };
  
  const updateProfile = async (userData: Partial<User>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("PUT", `/api/users/${user.id}`, userData);
      const updatedUser = await response.json();
      
      setUser({ ...user, ...updatedUser });
      localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
      
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}`] });
    } catch (err: any) {
      const errorMsg = err.message || "Failed to update profile. Please try again.";
      setError(errorMsg);
      
      toast({
        title: "Update failed",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        error, 
        login, 
        register, 
        logout, 
        updateProfile,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
