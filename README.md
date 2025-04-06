# PromptPad

PromptPad is an AI-powered web application that helps developers refine and enhance their application requirements. It uses Google's Gemini 1.5 Flash model to analyze requirements and suggest improvements, making it easier to create comprehensive and well-structured project specifications.

## Features

- **Requirements Analysis**: Write your app requirements in a clean, distraction-free notepad interface
- **AI-Powered Enhancements**: Toggle to receive AI-suggested improvements for your requirements
- **Multiple Coding Agents**: Choose from different coding agents (Cursor, Windsurf, Lovable, Bolt) to optimize the prompt for your preferred development environment
- **Interactive UI**:
  - Clean and responsive design using Tailwind CSS
  - Modal dialogs for refined prompts using shadcn/ui
  - Copy-to-clipboard functionality
  - Loading states and animations
- **Smart Suggestions**: Get 3-5 contextual enhancement suggestions that you can selectively include
- **Refined Output**: Receive a well-structured, detailed prompt that combines your original requirements with selected enhancements

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Google Gemini AI API
- React Hooks

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.17 or higher)
- npm (v9.6.7 or higher)
- A Google AI API key ([Get one here](https://makersuite.google.com/app/apikey))

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/promptpad.git
cd promptpad
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Google AI API key:
```bash
cp .env.example .env.local
```
Then edit `.env.local` and replace the placeholder with your actual API key.

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Write Requirements**:
   - Enter your application requirements in the main text area
   - Be as detailed as possible for better results

2. **Choose Enhancement Mode**:
   - Toggle "Suggest Enhancements" ON to get AI suggestions
   - Toggle OFF to directly get a refined prompt

3. **Select Coding Agent**:
   - Choose your preferred coding agent from the dropdown
   - This helps tailor the output to your development environment

4. **Process Requirements**:
   - Click "Generate" to process your input
   - If enhancements are enabled, you'll see suggested improvements
   - Select the enhancements you want to incorporate
   - Click "Confirm Selected Enhancements" to get the final prompt

5. **Use the Refined Prompt**:
   - Review the refined prompt in the modal dialog
   - Use the copy button to copy it to your clipboard
   - Close the dialog when done

## Development

- The application uses Next.js 14 with the App Router
- Components are built using shadcn/ui for consistency
- Tailwind CSS is used for styling
- TypeScript ensures type safety
- API routes handle communication with Google's Gemini AI

## Environment Variables

Required environment variables:
- `GOOGLE_AI_API_KEY`: Your Google AI API key for accessing Gemini models

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
