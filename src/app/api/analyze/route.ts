import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { prompt, suggestEnhancements, selectedAgent, technologies } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (suggestEnhancements) {
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [{
            text: `You are an AI assistant specialized in suggesting enhancements for software requirements. 
            Your task is to analyze the given requirements and suggest 3-5 meaningful improvements or additional features 
            that would make the application more robust, user-friendly, or feature-complete. 
            Format each suggestion as a clear, concise bullet point without any markdown formatting or special characters.
            Consider the following technologies in your suggestions: ${technologies.join(', ')}.
            
            Requirements:
            ${prompt}`
          }]
        }]
      });

      const response = await result.response;
      const suggestions = response.text()
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[•\-\*]\s*/, ''))
        .map(line => line.replace(/\*\*/g, ''))
        .map(line => line.trim());

      console.log('Gemini Analyze Response:', response.text());
      return NextResponse.json({ suggestions });
    } else {
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [{
            text: `You are an AI assistant specialized in refining software requirements for the ${selectedAgent} coding agent. 
            Your task is to analyze the given requirements and generate a clear, structured, and detailed prompt that will help 
            the coding agent better understand and implement the requirements. Focus on clarity, completeness, and technical specificity.
            Consider the following technologies in your response: ${technologies.join(', ')}.
            Format your response with bullet points where appropriate to improve readability.
            Do not use any markdown formatting or special characters in your response.
            
            Requirements:
            ${prompt}`
          }]
        }]
      });

      const response = await result.response;
      console.log('Gemini Analyze Response:', response.text());
      return NextResponse.json({
        refinedPrompt: response.text().replace(/\*\*/g, '')
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    );
  }
} 