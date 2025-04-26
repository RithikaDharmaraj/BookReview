import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";

export default function ReadersChoice() {
  // Top books by category
  const categoryWinners = [
    {
      id: 6,
      category: "Fiction",
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80",
      rating: 5.0
    },
    {
      id: 1,
      category: "Mystery",
      title: "The Silent Patient",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80",
      rating: 4.5
    },
    {
      id: 7,
      category: "Non-Fiction",
      title: "Educated",
      cover: "https://images.unsplash.com/photo-1587876931567-564ce588bfbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80",
      rating: 4.0
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-8">Readers' Choice Awards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col sm:flex-row bg-background-light rounded-lg overflow-hidden shadow-sm">
              <div className="sm:w-1/3 relative">
                <img 
                  src="https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Book of the Month" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 bg-primary text-white py-1 px-3 text-sm font-bold">
                  BOOK OF THE MONTH
                </div>
              </div>
              <div className="sm:w-2/3 p-6">
                <h3 className="font-heading font-bold text-xl mb-2">The Invisible Life of Addie LaRue</h3>
                <p className="text-gray-600 text-sm mb-3">V.E. Schwab</p>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    <StarIcon className="h-4 w-4 fill-current" />
                    <StarIcon className="h-4 w-4 fill-current" />
                    <StarIcon className="h-4 w-4 fill-current" />
                    <StarIcon className="h-4 w-4 fill-current" />
                    <StarIcon className="h-4 w-4 fill-current stroke-yellow-400" strokeWidth={2} fill="none" />
                  </div>
                  <span className="text-sm text-gray-600">4.6 (8.2k reviews)</span>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  A life no one will remember. A story you will never forget. France, 1714: in a moment of desperation, a young woman makes a Faustian bargain to live forever—and is cursed to be forgotten by everyone she meets.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">Fantasy</span>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">Historical Fiction</span>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">Romance</span>
                </div>
                <Button asChild>
                  <Link href="/books/5">
                    Read Reviews
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-heading font-bold text-lg mb-4">Top in Categories</h3>
            <div className="space-y-4">
              {categoryWinners.map((winner, index) => (
                <Link key={index} href={`/books/${winner.id}`}>
                  <div className="flex items-center bg-background-light p-3 rounded-lg hover:shadow-md transition-shadow">
                    <img 
                      src={winner.cover} 
                      alt={`${winner.category} winner`} 
                      className="w-14 h-20 object-cover rounded mr-3"
                    />
                    <div>
                      <span className="block text-xs font-bold text-primary uppercase">{winner.category}</span>
                      <h4 className="font-medium text-gray-900">{winner.title}</h4>
                      <div className="flex text-yellow-400 text-xs mt-1">
                        {Array(5).fill(0).map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(winner.rating) ? "fill-current" : i < winner.rating ? "fill-current stroke-current" : "stroke-current fill-none"}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
