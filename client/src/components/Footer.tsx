import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { SiGoodreads } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-accent" />
              <span className="text-2xl font-heading font-bold">BookWise</span>
            </div>
            <p className="text-gray-400 mb-4">Discover your next favorite book and connect with readers worldwide.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent">
                <SiGoodreads />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-all">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse" className="text-gray-400 hover:text-white transition-all">
                  Browse Books
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-all">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-all">
                  Reading Challenge
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-all">
                  Community
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-white transition-all">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-white transition-all">
                  My Books
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-white transition-all">
                  Reviews
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-all">
                  Settings
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-all">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with the latest book releases and reviews.</p>
            <form className="mb-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 rounded-r-none text-gray-900 focus:outline-none"
                />
                <Button type="submit" className="rounded-l-none bg-accent hover:bg-accent-dark text-white font-medium transition-all">
                  Sign Up
                </Button>
              </div>
            </form>
            <p className="text-xs text-gray-500">
              By signing up you agree to our <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 BookWise. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
