'use client';

import { useState } from 'react';
import { Loader2, Copy, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const codingAgents = [
  { id: 'cursor', name: 'Cursor' },
  { id: 'windsurf', name: 'Windsurf' },
  { id: 'lovable', name: 'Lovable' },
  { id: 'bolt', name: 'Bolt' }
];

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
      <h1 className="text-4xl font-bold mb-8 text-center">PromptPad</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Write your app requirements
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your app requirements here..."
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={suggestEnhancements}
                onChange={(e) => setSuggestEnhancements(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">Suggest Enhancements</span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Coding Agent:</label>
            <select
              value={selectedAgent.id}
              onChange={(e) => setSelectedAgent(codingAgents.find(agent => agent.id === e.target.value) || codingAgents[0])}
              className="border rounded-md py-1 px-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {codingAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !prompt}
          className="w-full"
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
          <h2 className="text-xl font-semibold">Suggested Enhancements</h2>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <label key={index} className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSuggestions.includes(suggestion)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSuggestions([...selectedSuggestions, suggestion]);
                    } else {
                      setSelectedSuggestions(selectedSuggestions.filter(s => s !== suggestion));
                    }
                  }}
                  className="mt-1"
                />
                <span className="text-gray-700">{suggestion}</span>
              </label>
            ))}
          </div>
          <Button
            onClick={handleConfirmSuggestions}
            disabled={isLoading || selectedSuggestions.length === 0}
            className="w-full"
            variant="default"
          >
            Confirm Selected Enhancements
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Refined Prompt</DialogTitle>
            <DialogDescription>
              Here's your refined prompt optimized for {selectedAgent.name}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <pre className="whitespace-pre-wrap text-gray-700 text-sm">{refinedPrompt}</pre>
          </div>
          <DialogFooter className="flex justify-between items-center mt-6">
            <Button
              onClick={handleCopyPrompt}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Copy className="h-4 w-4" />
              {copySuccess ? 'Copied!' : 'Copy Prompt'}
            </Button>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="flex items-center gap-2"
              variant="ghost"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
