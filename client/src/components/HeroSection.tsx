import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-secondary py-16 md:py-24">
      <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
            Discover Your Next <span className="text-accent font-accent italic">Favorite</span> Book
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Join thousands of readers sharing thoughtful reviews and discovering literary treasures
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              asChild
              size="lg"
              className="bg-primary hover:bg-primary-dark text-white font-medium transition-all"
            >
              <Link href="/browse">
                Browse Bestsellers
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="bg-white hover:bg-gray-100 text-secondary font-medium transition-all"
            >
              <Link href="/books/1">
                Write a Review
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
