import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { prompt, technologies } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a more detailed prompt that includes technologies and formatting instructions
    const enhancedPrompt = `Given the following technologies: ${technologies.join(', ')}.
    
Please refine and enhance this prompt for better results:
"${prompt}"

Requirements:
1. Keep the core intent of the original prompt
2. Optimize the prompt for the specified technologies
3. Make it more specific and detailed
4. Format the response with bullet points where appropriate
5. Ensure the response is well-structured and easy to read
6. Consider the technical implications of the selected technologies
7. Include relevant technical details specific to the chosen technologies

Please provide the enhanced prompt.`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 