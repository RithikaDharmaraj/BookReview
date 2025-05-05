import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDRjMCAyLjIxIDEuNzkgNCA0IDRzNC0xLjc5IDQtNHptLTI4IDhWMjZjMC0yLjIxIDEuNzktNCA0LTRoNGMyLjIxIDAgNCAxLjc5IDQgNHYxNmMwIDIuMjEtMS43OSA0LTQgNGgtNGMtMi4yMSAwLTQtMS43OS00LTR6bTAgMjRWNThjMC0yLjIxIDEuNzktNCA0LTRoNGMyLjIxIDAgNCAxLjc5IDQgNHYxNmMwIDIuMjEtMS43OSA0LTQgNGgtNGMtMi4yMSAwLTQtMS43OS00LTR6TTggNzguMjFWNDJjMC0yLjIxIDEuNzktNCA0LTRoNGMyLjIxIDAgNCAxLjc5IDQgNHYzNi4yMWMwIDIuMjEtMS43OSA0LTQgNGgtNGMtMi4yMSAwLTQtMS43OS00LTR6TTM2IDg2YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>
      
      {/* Content */}
      <div className="container relative mx-auto px-4 text-white z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-xl md:max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">Discover Your Next</span> <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">Favorite Book</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-lg">
            Join thousands of readers sharing honest reviews and discovering new worlds through literature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/books">
              <Button size="lg" variant="default" className="bg-white text-indigo-700 hover:bg-indigo-50 w-full sm:w-auto text-base shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 h-auto font-medium">
                Browse Books
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 hover:border-white w-full sm:w-auto text-base transition-all duration-200 px-8 py-3 h-auto font-medium">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="hidden md:block relative">
          <div className="relative">
            {/* Decorative book stack */}
            <div className="absolute -bottom-8 -left-24 w-40 h-48 bg-indigo-400 rounded-md transform rotate-12 shadow-2xl"></div>
            <div className="absolute -bottom-6 -left-12 w-40 h-48 bg-indigo-300 rounded-md transform rotate-6 shadow-2xl"></div>
            <div className="relative w-56 h-72 bg-white rounded-md shadow-2xl overflow-hidden transform -rotate-3 z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-90"></div>
              <div className="absolute inset-x-0 bottom-0 top-12 flex flex-col items-center justify-center text-white p-4">
                <div className="w-12 h-1 bg-white mb-4 rounded-full"></div>
                <div className="text-xl font-bold text-center">BookBuddy</div>
                <div className="text-sm opacity-90 text-center">Your Reading Journey</div>
                <div className="mt-6 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-sm transform rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave shape at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-[60px] text-white">
          <path fill="currentColor" fillOpacity="1" d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
}
