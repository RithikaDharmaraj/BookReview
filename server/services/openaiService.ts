import OpenAI from "openai";

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;

// Function to get or lazily initialize OpenAI client
function getOpenAIClient(): OpenAI | null {
  if (openai !== null) {
    return openai;
  }
  
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === "") {
    console.warn("OPENAI_API_KEY is not set or empty. OpenAI features will be disabled.");
    return null;
  }
  
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return openai;
  } catch (error) {
    console.error("Failed to initialize OpenAI client:", error);
    return null;
  }
}

/**
 * Refines a book review using OpenAI's GPT model
 * Improves grammar, clarity, and tone while preserving the original sentiment
 */
export async function refineReviewWithAI(reviewContent: string): Promise<string> {
  try {
    // Try to get the OpenAI client
    const client = getOpenAIClient();
    if (!client) {
      console.warn("OpenAI client not available. Returning original review content.");
      return reviewContent;
    }

    // Enhanced error handling for OpenAI API calls
    try {
      const response = await client.chat.completions.create({
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        model: "gpt-4o", 
        messages: [
          {
            role: "system",
            content: `You are a book review editor. Your job is to refine the review while maintaining the original sentiment, opinion, and rating. 
            Improve grammar, clarity, and tone. Make the review more engaging and well-structured. 
            Do not add information or change the user's opinion. Simply improve the writing quality.`
          },
          {
            role: "user",
            content: reviewContent
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return response.choices[0].message.content || reviewContent;
    } catch (apiError: any) {
      // Handle specific OpenAI API errors
      if (apiError.status === 429) {
        console.warn("OpenAI API rate limit exceeded or insufficient quota. Skipping AI refinement.");
      } else {
        console.error("OpenAI API error:", apiError.message || apiError);
      }
      return reviewContent;
    }
  } catch (error) {
    console.error("Error refining review with AI:", error);
    // Return the original content if there's an error
    return reviewContent;
  }
}
