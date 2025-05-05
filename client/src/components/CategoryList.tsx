import CategoryCard from "@/components/CategoryCard";

interface Category {
  title: string;
  count: number;
  icon: string;
  color: string;
}

interface CategoryListProps {
  categories: Category[];
  title?: string;
  description?: string;
}

export default function CategoryList({ 
  categories, 
  title = "Categories", 
  description = "Explore books by genre and discover your next favorite read" 
}: CategoryListProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">{title}</h2>
          {description && <p className="text-gray-600 text-center mt-2">{description}</p>}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              count={category.count}
              icon={category.icon}
              color={category.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
