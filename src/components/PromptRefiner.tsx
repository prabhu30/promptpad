'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { TechnologySelector } from './TechnologySelector';

interface Technology {
  id: string;
  name: string;
}

export function PromptRefiner() {
  const [prompt, setPrompt] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<Technology[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState('');

  const handleRefine = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          technologies: selectedTechnologies.map(tech => tech.name),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refine prompt');
      }

      const data = await response.json();
      setRefinedPrompt(data.text);
      setEditedPrompt(data.text);
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editedPrompt : refinedPrompt);
  };

  const handleSaveEdit = () => {
    setRefinedPrompt(editedPrompt);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Enter your prompt
        </label>
        <textarea
          className="w-full h-32 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
        />
      </div>

      <TechnologySelector
        selectedTechnologies={selectedTechnologies}
        onChange={setSelectedTechnologies}
      />

      <Button
        onClick={handleRefine}
        disabled={isLoading || !prompt.trim()}
        className="w-full"
      >
        {isLoading ? 'Refining...' : 'Refine Prompt'}
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setIsEditing(false);
        }}
        title="Refined Prompt"
      >
        <div className="space-y-4">
          {isEditing ? (
            <textarea
              className="w-full h-64 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {refinedPrompt.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
              >
                Edit
              </Button>
            ) : (
              <Button
                onClick={handleSaveEdit}
                variant="secondary"
              >
                Save
              </Button>
            )}
            <Button onClick={handleCopy}>
              Copy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 