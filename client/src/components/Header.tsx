import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "@/components/SearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Menu, User, LogOut, BookOpen, Home, Grid3X3, Info } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-1 14H4V6h16v12z"></path>
                <path d="M9.5 9.5h5v1h-5zm0 2h5v1h-5zm0 2h3v1h-3z"></path>
              </svg>
            </div>
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">BookBuddy</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/">
              <span className={`relative py-1 px-1 font-medium hover:text-indigo-700 transition-colors ${location === "/" ? "text-indigo-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-700 after:rounded-full" : "text-gray-700"}`}>
                Home
              </span>
            </Link>
            <Link href="/books">
              <span className={`relative py-1 px-1 font-medium hover:text-indigo-700 transition-colors ${location === "/books" ? "text-indigo-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-700 after:rounded-full" : "text-gray-700"}`}>
                Books
              </span>
            </Link>
            <Link href="/categories">
              <span className={`relative py-1 px-1 font-medium hover:text-indigo-700 transition-colors ${location === "/categories" ? "text-indigo-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-700 after:rounded-full" : "text-gray-700"}`}>
                Categories
              </span>
            </Link>
            <Link href="/about">
              <span className={`relative py-1 px-1 font-medium hover:text-indigo-700 transition-colors ${location === "/about" ? "text-indigo-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-700 after:rounded-full" : "text-gray-700"}`}>
                About
              </span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative hidden md:block w-64">
            <SearchBar className="w-full" />
          </div>

          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
          >
            <Search className="h-5 w-5" />
          </button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage || undefined} alt={user?.name || undefined} />
                    <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{user?.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/my-books">
                  <DropdownMenuItem>
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>My Books</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-3">
              <Link href="/login">
                <Button variant="outline" size="sm" className="font-medium border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-all duration-200">
                  Log in
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200">
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <div className="flex items-center">
                      <Home className="mr-2 h-5 w-5" />
                      <span>Home</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/books">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" />
                      <span>Books</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <div className="flex items-center">
                      <Grid3X3 className="mr-2 h-5 w-5" />
                      <span>Categories</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <div className="flex items-center">
                      <Info className="mr-2 h-5 w-5" />
                      <span>About</span>
                    </div>
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link href="/register">
                    <Button className="w-full mt-4">Sign up</Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {mobileSearchVisible && (
        <div className="md:hidden px-4 py-3 bg-gray-50">
          <SearchBar className="w-full" />
        </div>
      )}
    </header>
  );
}
