import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">About BookBuddy</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Your trusted companion for discovering, reviewing, and sharing your favorite books.
            </p>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                At BookBuddy, we believe that reading is a journey that's better when shared. Our mission is to create a community where book lovers can discover new titles, share their thoughts, and connect with like-minded readers around the world.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We're dedicated to promoting literacy, fostering a love of reading, and making it easier than ever to find your next favorite book. Whether you're a casual reader or a dedicated bibliophile, BookBuddy is designed to enhance your reading experience.
              </p>
              <p className="text-lg text-gray-700">
                Through our platform, we aim to bring together diverse perspectives, celebrate authors from all backgrounds, and create a space where everyone's reading journey is valued and respected.
              </p>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Curated Book Recommendations</h3>
                <p className="text-gray-600 text-center">
                  Discover new books tailored to your reading preferences and explore titles across various genres.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Thoughtful Reviews</h3>
                <p className="text-gray-600 text-center">
                  Share your opinions and read authentic reviews from our community of passionate readers.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Reader Community</h3>
                <p className="text-gray-600 text-center">
                  Connect with other book enthusiasts, follow readers with similar tastes, and build your reading network.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="h-32 w-32 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                    alt="John Smith"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">John Smith</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
              
              <div className="text-center">
                <div className="h-32 w-32 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                    alt="Sarah Johnson"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Sarah Johnson</h3>
                <p className="text-gray-600">Chief Content Officer</p>
              </div>
              
              <div className="text-center">
                <div className="h-32 w-32 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                    alt="Michael Chen"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Michael Chen</h3>
                <p className="text-gray-600">Head of Technology</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 bg-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Community Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start your reading journey with BookBuddy and discover your next favorite book.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
              <Link href="/register">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
