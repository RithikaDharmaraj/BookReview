import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

// Define available genres
const genres = [
  "Fiction", 
  "Mystery", 
  "Thriller", 
  "Science Fiction", 
  "Fantasy", 
  "Romance", 
  "Historical Fiction", 
  "Biography", 
  "Self Help", 
  "Nonfiction",
  "Literary Fiction",
  "Psychological Fiction"
];

interface FiltersProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

export default function Filters({ selectedGenre, onGenreChange }: FiltersProps) {
  const [isGenresOpen, setIsGenresOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 30]);
  
  // Sort genres alphabetically
  const sortedGenres = [...genres].sort();
  
  return (
    <div className="space-y-6">
      <Collapsible
        open={isGenresOpen}
        onOpenChange={setIsGenresOpen}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Genre</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              {isGenresOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-3">
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {sortedGenres.map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox 
                  id={`genre-${genre}`} 
                  checked={selectedGenre === genre}
                  onCheckedChange={() => onGenreChange(genre)}
                />
                <label
                  htmlFor={`genre-${genre}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {genre}
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      <Collapsible
        open={isPriceOpen}
        onOpenChange={setIsPriceOpen}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Price Range</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              {isPriceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-3">
          <div className="space-y-4">
            <Slider
              value={priceRange}
              min={0}
              max={50}
              step={1}
              onValueChange={setPriceRange}
              className="my-6"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">${priceRange[0]}</span>
              <span className="text-sm font-medium">${priceRange[1]}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              disabled
            >
              Apply Price Filter
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      <div className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onGenreChange("")}
          disabled={!selectedGenre}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
