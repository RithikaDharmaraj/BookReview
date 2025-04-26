import { Link } from "wouter";
import { 
  Rocket, 
  Heart, 
  BookOpen, 
  Skull, 
  Landmark, 
  Brain 
} from "lucide-react";

// Example categories data
const categories = [
  { name: "Sci-Fi", icon: <Rocket className="text-2xl text-accent mb-3" />, count: 1245 },
  { name: "Romance", icon: <Heart className="text-2xl text-accent mb-3" />, count: 2183 },
  { name: "Literary Fiction", icon: <BookOpen className="text-2xl text-accent mb-3" />, count: 954 },
  { name: "Mystery", icon: <Skull className="text-2xl text-accent mb-3" />, count: 1683 },
  { name: "Historical", icon: <Landmark className="text-2xl text-accent mb-3" />, count: 847 },
  { name: "Self Help", icon: <Brain className="text-2xl text-accent mb-3" />, count: 1129 },
];

export default function Categories() {
  return (
    <section className="py-12 bg-background-light">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-8">Browse by Category</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link 
              key={index}
              href={`/browse?genre=${encodeURIComponent(category.name)}`}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md flex flex-col items-center justify-center transition-all text-center h-32"
            >
              {category.icon}
              <span className="font-medium text-gray-900">{category.name}</span>
              <span className="text-xs text-gray-500 mt-1">{category.count.toLocaleString()} books</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
