import { Link } from "wouter";

import { Facebook, Twitter, Instagram, BookOpen, ChevronRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white pt-16 pb-8 relative">
      {/* Top wave decoration */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-[60px] text-indigo-900">
          <path fill="currentColor" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-md mr-3">
                <BookOpen className="h-6 w-6 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">BookBuddy</h3>
            </div>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Your trusted companion for discovering, tracking, and reviewing the best books from around the world.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="bg-indigo-800 p-2 rounded-full hover:bg-indigo-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-indigo-800 p-2 rounded-full hover:bg-indigo-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-indigo-800 p-2 rounded-full hover:bg-indigo-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-bold mb-5 text-white">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-indigo-200 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-indigo-200 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Books
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-indigo-200 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-indigo-200 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Reviews
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-bold mb-5 text-white">Account</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/login" className="text-indigo-200 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-indigo-200 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Register
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-indigo-200 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/my-books" className="text-indigo-200 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  My Books
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-bold mb-5 text-white">About</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-indigo-200 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-indigo-200 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-indigo-200 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-indigo-200 hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-indigo-800/30 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-indigo-300 text-sm">&copy; {new Date().getFullYear()} BookBuddy. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-indigo-300 hover:text-white text-sm transition-colors">Privacy</Link>
            <Link href="/terms" className="text-indigo-300 hover:text-white text-sm transition-colors">Terms</Link>
            <Link href="/cookies" className="text-indigo-300 hover:text-white text-sm transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
