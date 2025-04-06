'use client';

import { useState } from 'react';
import { Loader2, Copy, X } from 'lucide-react';
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<Technology[]>([]);

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">PromptPad</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Write your app requirements
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-48 p-4 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your app requirements here..."
          />
        </div>

        <TechnologySelector
          selectedTechnologies={selectedTechnologies}
          onChange={setSelectedTechnologies}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="suggest-enhancements"
                checked={suggestEnhancements}
                onCheckedChange={setSuggestEnhancements}
                className="transition-all duration-200 ease-in-out cursor-pointer"
              />
              <label
                htmlFor="suggest-enhancements"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-200"
              >
                Suggest Enhancements
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Coding Agent:</label>
            <Select
              value={selectedAgent.id}
              onValueChange={(value) => setSelectedAgent(codingAgents.find(agent => agent.id === value) || codingAgents[0])}
            >
              <SelectTrigger className="w-[180px] cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
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

        <Button
          type="submit"
          disabled={isLoading || !prompt}
          className="w-full cursor-pointer"
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
      </form>

      {suggestions.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Suggested Enhancements</h2>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center space-x-3">
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
                  className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  {suggestion}
                </label>
              </div>
            ))}
          </div>
          <Button
            onClick={handleConfirmSuggestions}
            disabled={isLoading}
            className="w-full cursor-pointer"
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
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Refined Prompt</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Here&apos;s your refined prompt optimized for {selectedAgent.id === 'any' ? 'any coding agent' : `${selectedAgent.name} coding agent`}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 text-sm max-h-[50vh] overflow-y-auto">
              {refinedPrompt.split('\n').map((line, index) => {
                // Check if the line starts with a bullet point or asterisk
                const bulletMatch = line.match(/^(\s*)([•\-\*])\s*(.*)/);
                if (bulletMatch) {
                  const [, indentation, bullet, content] = bulletMatch;
                  return (
                    <p key={index} className="flex mb-2">
                      <span className="whitespace-pre">{indentation}</span>
                      <span className="mr-2">{bullet === '*' ? '•' : bullet}</span>
                      <span>{content}</span>
                    </p>
                  );
                }
                // Check if the line is empty (preserve spacing)
                if (line.trim() === '') {
                  return <p key={index} className="h-4"></p>;
                }
                return <p key={index} className="mb-2">{line}</p>;
              })}
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center mt-6">
            <Button
              onClick={handleCopyPrompt}
              className="flex items-center gap-2 cursor-pointer bg-gray-800 text-white hover:bg-gray-700 hover:text-white dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300 dark:hover:text-gray-800 transition-none"
              variant="outline"
            >
              <Copy className="h-4 w-4" />
              {copySuccess ? 'Copied!' : 'Copy Prompt'}
            </Button>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="flex items-center gap-2 cursor-pointer"
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
