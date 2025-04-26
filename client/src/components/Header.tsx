import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "./SearchBar";
import { 
  Menu, 
  Bell, 
  BookOpen 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-2xl text-primary" />
          <Link href="/" className="text-2xl font-heading font-bold text-primary">
            BookWise
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-6">
            <Link href="/" className="font-medium text-gray-800 hover:text-primary transition-all">
              Home
            </Link>
            <Link href="/browse" className="font-medium text-gray-800 hover:text-primary transition-all">
              Browse
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/profile" className="font-medium text-gray-800 hover:text-primary transition-all">
                  My Books
                </Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            <SearchBar />
            
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary transition-all">
                    <Bell className="h-5 w-5" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9 border-2 border-primary cursor-pointer">
                          <AvatarImage src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"} alt={user?.username || "User"} />
                          <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.fullName || user?.username}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile menu button */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col gap-6 mt-6">
              <SearchBar mobile />
              
              <nav className="flex flex-col space-y-4">
                <SheetClose asChild>
                  <Link href="/" className="font-medium text-gray-800 hover:text-primary transition-all">
                    Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/browse" className="font-medium text-gray-800 hover:text-primary transition-all">
                    Browse
                  </Link>
                </SheetClose>
                {isAuthenticated && (
                  <SheetClose asChild>
                    <Link href="/profile" className="font-medium text-gray-800 hover:text-primary transition-all">
                      My Books
                    </Link>
                  </SheetClose>
                )}
              </nav>
              
              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"} alt={user?.username || "User"} />
                        <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user?.fullName || user?.username}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Button variant="outline" onClick={handleLogout} className="w-full">
                        Log out
                      </Button>
                    </SheetClose>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login">Log In</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild className="w-full">
                        <Link href="/register">Sign Up</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
