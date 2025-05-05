import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ 
  placeholder = "Search for books...", 
  className = "", 
  defaultValue = "",
  onSearch
}: SearchBarProps) {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  
  // Extract search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    const urlSearchQuery = params.get("search");
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [location]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If custom onSearch handler is provided, use it
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        // Otherwise, navigate to books page with search query
        setLocation(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };
  
  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-10 pr-16"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button 
        type="submit" 
        size="sm" 
        className="absolute right-1 top-1 h-8"
        disabled={!searchQuery.trim()}
      >
        Search
      </Button>
    </form>
  );
}
