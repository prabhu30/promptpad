import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { prompt, selectedSuggestions, selectedAgent, technologies } = await request.json();

    if (!prompt || !selectedSuggestions) {
      return NextResponse.json(
        { error: 'Prompt and selected suggestions are required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Clean up any markdown formatting from the suggestions
    const cleanSuggestions = selectedSuggestions.map((s: string) => s.replace(/\*\*/g, ''));

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{
          text: `You are an AI assistant specialized in refining software requirements for the ${selectedAgent} coding agent. 
          Your task is to combine the original requirements with the selected enhancements to create a comprehensive and well-structured prompt. 
          Ensure the final prompt is clear, detailed, and maintains technical specificity while incorporating all selected improvements seamlessly.
          Consider the following technologies in your response: ${technologies.join(', ')}.
          Format your response with bullet points where appropriate to improve readability.
          Do not use any markdown formatting or special characters in your response.
          
          Original requirements:
          ${prompt}
          
          Selected enhancements to incorporate:
          ${cleanSuggestions.map((s: string) => `- ${s}`).join('\n')}`
        }]
      }]
    });

    const response = await result.response;
    console.log('Gemini Refine Response:', response.text());
    return NextResponse.json({
      refinedPrompt: response.text().replace(/\*\*/g, '')
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    );
  }
} 