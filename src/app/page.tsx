'use client';

import { useState, useEffect } from 'react';
import { Loader2, Copy, X, HelpCircle, Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TechnologySelector } from '@/components/TechnologySelector';
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from 'next-themes';

const codingAgents = [
  { id: 'any', name: 'Any' },
  { id: 'cursor', name: 'Cursor' },
  { id: 'windsurf', name: 'Windsurf' },
  { id: 'lovable', name: 'Lovable' },
  { id: 'bolt', name: 'Bolt' },
  { id: 'codeium', name: 'Codeium' },
  { id: 'copilot', name: 'GitHub Copilot' },
  { id: 'tabnine', name: 'TabNine' }
];

interface Technology {
  id: string;
  name: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [suggestEnhancements, setSuggestEnhancements] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(codingAgents[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<Technology[]>([]);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          suggestEnhancements,
          selectedAgent: selectedAgent.id,
          technologies: selectedTechnologies.map(tech => tech.name),
        }),
      });

      const data = await response.json();

      if (suggestEnhancements) {
        setSuggestions(data.suggestions);
      } else {
        setRefinedPrompt(data.refinedPrompt);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSuggestions = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          selectedSuggestions,
          selectedAgent: selectedAgent.id,
          technologies: selectedTechnologies.map(tech => tech.name),
        }),
      });

      const data = await response.json();
      setRefinedPrompt(data.refinedPrompt);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(refinedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-white">PromptPad</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
            Write your app requirements
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-40 sm:h-48 p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your app requirements here..."
          />
        </div>

        <TechnologySelector
          selectedTechnologies={selectedTechnologies}
          onChange={setSelectedTechnologies}
        />

        <div className="mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Switch
                id="suggest-enhancements"
                checked={suggestEnhancements}
                onCheckedChange={setSuggestEnhancements}
                className="transition-all duration-200 ease-in-out cursor-pointer"
              />
              <label
                htmlFor="suggest-enhancements"
                className="text-sm sm:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-200"
              >
                Suggest Enhancements
              </label>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">Coding Agent:</label>
              <Select
                value={selectedAgent.id}
                onValueChange={(value) => setSelectedAgent(codingAgents.find(agent => agent.id === value) || codingAgents[0])}
              >
                <SelectTrigger className="w-full sm:w-[180px] cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {codingAgents.map((agent) => (
                    <SelectItem 
                      key={agent.id} 
                      value={agent.id}
                      className="cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-6 sm:mt-8 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Suggested Enhancements</h2>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start sm:items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Checkbox
                    id={`suggestion-${index}`}
                    checked={selectedSuggestions.includes(suggestion)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSuggestions([...selectedSuggestions, suggestion]);
                      } else {
                        setSelectedSuggestions(selectedSuggestions.filter(s => s !== suggestion));
                      }
                    }}
                  />
                  <label
                    htmlFor={`suggestion-${index}`}
                    className="text-sm sm:text-base text-gray-800 dark:text-gray-100 cursor-pointer"
                  >
                    {suggestion}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8">
          {suggestions.length > 0 ? (
            <Button
              onClick={handleConfirmSuggestions}
              disabled={isLoading}
              className="w-full cursor-pointer py-2 sm:py-3 text-base"
              variant="default"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Processing...
                </span>
              ) : (
                'Submit'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !prompt}
              className="w-full cursor-pointer py-2 sm:py-3 text-base"
              variant="default"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Processing...
                </span>
              ) : (
                'Generate'
              )}
            </Button>
          )}
        </div>
      </form>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        {mounted && (
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer w-full sm:w-auto"
          >
            {theme === 'light' ? (
              <>
                <Sun className="h-4 w-4" />
                <span className="leading-none">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span className="leading-none">Dark Mode</span>
              </>
            )}
          </Button>
        )}

        <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer w-full sm:w-auto flex items-center justify-center"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="leading-none">What can I do?</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 w-[95vw] sm:w-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">About PromptPad</DialogTitle>
            </DialogHeader>
            <div className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mt-4 space-y-4">
              <DialogDescription asChild>
                <span>
                  PromptPad is an AI-powered tool designed to help you create better, more effective prompts for various coding agents. Here's what you can do:
                </span>
              </DialogDescription>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">Key Features:</h3>
                <ul className="list-disc pl-4 sm:pl-5 space-y-2">
                  <li>Write your requirements in a clean, distraction-free interface</li>
                  <li>Get AI-suggested improvements for your requirements</li>
                  <li>Choose from different coding agents (Cursor, GitHub Copilot, etc.)</li>
                  <li>Refine your prompts for better results</li>
                  <li>Copy the enhanced prompts to use with your preferred coding agent</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">How to Use:</h3>
                <ul className="list-disc pl-4 sm:pl-5 space-y-2">
                  <li>Enter your requirements in the text area</li>
                  <li>Toggle "Suggest Enhancements" to get AI improvements</li>
                  <li>Select your preferred coding agent</li>
                  <li>Click Generate to get your refined prompt</li>
                  <li>Review and copy the enhanced prompt</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsHelpDialogOpen(false)}
                className="cursor-pointer w-full sm:w-auto"
                variant="ghost"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 w-[95vw] sm:w-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Refined Prompt</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Here&apos;s your refined prompt optimized for {selectedAgent.id === 'any' ? 'any coding agent' : `${selectedAgent.name} coding agent`}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 text-sm sm:text-base max-h-[40vh] sm:max-h-[50vh] overflow-y-auto">
              {refinedPrompt.split('\n').map((line, index) => {
                const bulletMatch = line.match(/^(\s*)([•\-\*])\s*(.*)/);
                if (bulletMatch) {
                  const [, indentation, bullet, content] = bulletMatch;
                  return (
                    <div key={index} className="flex mb-2">
                      <span className="whitespace-pre">{indentation}</span>
                      <span className="mr-2">{bullet === '*' ? '•' : bullet}</span>
                      <span>{content}</span>
                    </div>
                  );
                }
                if (line.trim() === '') {
                  return <div key={index} className="h-4"></div>;
                }
                return <div key={index} className="mb-2">{line}</div>;
              })}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mt-6">
            <Button
              onClick={handleCopyPrompt}
              className="flex items-center gap-2 cursor-pointer bg-gray-800 text-white hover:bg-gray-700 hover:text-white dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300 dark:hover:text-gray-800 transition-none w-full sm:w-auto"
              variant="outline"
            >
              <Copy className="h-4 w-4" />
              {copySuccess ? 'Copied!' : 'Copy Prompt'}
            </Button>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="flex items-center gap-2 cursor-pointer w-full sm:w-auto"
              variant="ghost"
            >
              <X className="h-4 w-4 cursor-pointer" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
