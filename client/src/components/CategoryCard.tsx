import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book, BookOpen, Heart, Zap, User, Search, History, Star, Brain, BarChart, Wand, Landmark } from "lucide-react";

interface CategoryCardProps {
  title: string;
  count: number;
  icon: string;
  color: string;
}

export default function CategoryCard({ title, count, icon, color }: CategoryCardProps) {
  const getIcon = () => {
    // Use white for all icons in colored backgrounds
    const iconClasses = "h-7 w-7 text-white";
    
    switch (icon) {
      case "book":
        return <Book className={iconClasses} />;
      case "file-text":
        return <BookOpen className={iconClasses} />;
      case "heart":
        return <Heart className={iconClasses} />;
      case "lightning":
        return <Zap className={iconClasses} />;
      case "user":
        return <User className={iconClasses} />;
      case "search":
        return <Search className={iconClasses} />;
      case "landmark":
        return <Landmark className={iconClasses} />;
      case "star":
        return <Star className={iconClasses} />;
      case "brain":
        return <Brain className={iconClasses} />;
      case "chart-line":
        return <BarChart className={iconClasses} />;
      case "wand":
        return <Wand className={iconClasses} />;
      case "glasses":
        return <BookOpen className={iconClasses} />;
      case "atom":
        return <Zap className={iconClasses} />;
      case "book-open":
        return <BookOpen className={iconClasses} />;
      default:
        return <Book className={iconClasses} />;
    }
  };

  // Direct color mappings instead of dynamic class interpolation (which doesn't work well with TailwindCSS)
  const getColorClasses = () => {
    switch (color) {
      case "primary": 
        return {
          gradientFrom: "from-indigo-500",
          gradientTo: "to-indigo-700",
          iconBg: "bg-white/20",
          hoverBg: "hover:bg-indigo-600",
          shadow: "shadow-indigo-200/50"
        };
      case "blue": 
        return {
          gradientFrom: "from-blue-500",
          gradientTo: "to-blue-700",
          iconBg: "bg-white/20",
          hoverBg: "hover:bg-blue-600",
          shadow: "shadow-blue-200/50"
        };
      case "green": 
        return {
          gradientFrom: "from-emerald-500",
          gradientTo: "to-emerald-700",
          iconBg: "bg-white/20",
          hoverBg: "hover:bg-emerald-600",
          shadow: "shadow-emerald-200/50"
        };
      case "yellow": 
        return {
          gradientFrom: "from-amber-500",
          gradientTo: "to-amber-700",
          iconBg: "bg-white/20",
          hoverBg: "hover:bg-amber-600",
          shadow: "shadow-amber-200/50"
        };
      case "red": 
        return {
          gradientFrom: "from-rose-500",
          gradientTo: "to-rose-700",
          iconBg: "bg-white/20",
          hoverBg: "hover:bg-rose-600",
          shadow: "shadow-rose-200/50"
        };
      case "purple": 
        return {
          gradientFrom: "from-purple-500",
          gradientTo: "to-purple-700",
          iconBg: "bg-white/20",
          hoverBg: "hover:bg-purple-600",
          shadow: "shadow-purple-200/50"
        };
      default: 
        return {
          gradientFrom: "from-gray-500",
          gradientTo: "to-gray-700",
          iconBg: "bg-white/20",
          hoverBg: "hover:bg-gray-600",
          shadow: "shadow-gray-200/50"
        };
    }
  };
  
  const colorClasses = getColorClasses();

  return (
    <Card className={`overflow-hidden transition-all duration-300 border-0 group hover:-translate-y-1 shadow-md hover:shadow-xl ${colorClasses.shadow}`}>
      <CardContent className="p-0">
        <div className={`bg-gradient-to-br ${colorClasses.gradientFrom} ${colorClasses.gradientTo} ${colorClasses.hoverBg} text-white p-6 h-full transition-colors duration-300`}>
          <div className="flex flex-col items-center text-center">
            <div className={`h-16 w-16 rounded-full ${colorClasses.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{title}</h3>
              <p className="text-sm text-white/80 font-medium">{count} books</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
