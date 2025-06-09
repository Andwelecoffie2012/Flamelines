import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function generateFlame(mode: string, input?: string): Promise<string> {
  try {
    const systemPrompts = {
      bar: "You are a creative rap and hip-hop lyricist specializing in clever bars and wordplay. Create original, witty rap lines that are clever, confident, and creative. Focus on wordplay, metaphors, and punchlines that would impress in a cypher or freestyle battle.",
      flirty: "You are a charismatic conversationalist who creates smooth, charming, and playful flirty lines. Keep them clever, respectful, and fun - the kind that would make someone smile and feel special. Avoid anything crude or inappropriate.",
      roast: "You are a master of comedic roasting, creating clever burns and witty comebacks. Make them sharp and funny but not mean-spirited or personally attacking. Focus on universal, relatable situations that are humorous rather than hurtful.",
      compliment: "You are an expert at creating genuine, creative compliments that make people feel valued and special. Craft unique, thoughtful compliments that go beyond the ordinary and make someone's day brighter.",
      joke: "You are a comedian specializing in clever one-liners, puns, and witty observations. Create original jokes that are smart, clean, and genuinely funny. Focus on wordplay, unexpected twists, and relatable humor."
    };

    const systemPrompt = systemPrompts[mode as keyof typeof systemPrompts] || systemPrompts.bar;
    
    let userPrompt = `Create one original ${mode} line.`;
    if (input && input.trim()) {
      userPrompt += ` Context or theme: "${input.trim()}"`;
    }
    userPrompt += " Respond with just the line, no extra text or quotes.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    const content = response.choices[0].message.content?.trim();
    
    if (!content) {
      throw new Error("No content generated");
    }

    return content;
  } catch (error) {
    console.error("OpenAI generation error:", error);
    
    // Provide better error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("OpenAI API key is missing or invalid. Please check your configuration.");
      }
      if (error.message.includes("quota")) {
        throw new Error("OpenAI API quota exceeded. Please try again later.");
      }
      if (error.message.includes("rate limit")) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }
    }
    
    throw new Error("Failed to generate content. Please try again.");
  }
}
