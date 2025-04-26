import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedBooks from "@/components/FeaturedBooks";
import Categories from "@/components/Categories";
import RecentReviews from "@/components/RecentReviews";
import ReadingChallenge from "@/components/ReadingChallenge";
import ReadersChoice from "@/components/ReadersChoice";
import { useBooks } from "@/context/BookContext";
import { Helmet } from "react-helmet";

export default function HomePage() {
  const { loadFeaturedBooks } = useBooks();

  useEffect(() => {
    document.title = "BookWise - Discover Your Next Favorite Book";
    loadFeaturedBooks();
  }, [loadFeaturedBooks]);

  return (
    <>
      <Helmet>
        <title>BookWise - Discover Your Next Favorite Book</title>
        <meta name="description" content="Join thousands of readers sharing thoughtful reviews and discovering literary treasures at BookWise." />
      </Helmet>
      
      {/* Hero section with book discovery message */}
      <HeroSection />
      
      {/* Featured books section */}
      <FeaturedBooks />
      
      {/* Book categories section */}
      <Categories />
      
      {/* Recent community reviews */}
      <RecentReviews />
      
      {/* Reading challenge section */}
      <ReadingChallenge />
      
      {/* Readers' choice awards section */}
      <ReadersChoice />
    </>
  );
}
