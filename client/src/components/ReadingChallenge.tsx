import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";

export default function ReadingChallenge() {
  const { isAuthenticated } = useAuth();
  
  // Mock data for display
  const challengeData = {
    totalBooks: 50,
    completedBooks: 12,
    progressPercentage: 24,
    daysStreak: 42,
    pagesRead: 4328,
    reviews: 36,
    genres: 8,
    ranking: 17
  };

  return (
    <section className="py-12 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">2025 Reading Challenge</h2>
            <p className="text-gray-200 mb-6">
              Challenge yourself to read more books this year! Set a goal and track your progress. Join with friends to stay motivated.
            </p>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Your progress:</span>
                <span className="text-accent font-bold">
                  {challengeData.completedBooks} of {challengeData.totalBooks} books
                </span>
              </div>
              <Progress 
                value={challengeData.progressPercentage} 
                className="h-3 mb-4 bg-white bg-opacity-20"
              />
              <p className="text-sm text-gray-200">
                You're {challengeData.completedBooks > 10 ? "2 books ahead" : "behind"} of schedule! Keep it up!
              </p>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-accent mb-1">{challengeData.daysStreak}</div>
                <div className="text-sm text-gray-200">Days Streak</div>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-accent mb-1">{challengeData.completedBooks}</div>
                <div className="text-sm text-gray-200">Books Read</div>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-accent mb-1">{challengeData.pagesRead.toLocaleString()}</div>
                <div className="text-sm text-gray-200">Pages Read</div>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-accent mb-1">{challengeData.reviews}</div>
                <div className="text-sm text-gray-200">Reviews</div>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-accent mb-1">{challengeData.genres}</div>
                <div className="text-sm text-gray-200">Genres</div>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-accent mb-1">#{challengeData.ranking}</div>
                <div className="text-sm text-gray-200">Ranking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
