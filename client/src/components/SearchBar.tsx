import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  mobile?: boolean;
}

export default function SearchBar({ mobile = false }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative group ${mobile ? "w-full" : "w-40 md:w-60"}`}>
      <Input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="py-2 pl-4 pr-10 rounded-full text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
      />
      <button
        type="submit"
        className="absolute right-3 top-2.5 text-gray-400 group-focus-within:text-primary"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
