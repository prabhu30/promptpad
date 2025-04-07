'use client';

import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface Technology {
  id: string;
  name: string;
}

interface TechnologySelectorProps {
  selectedTechnologies: Technology[];
  onChange: (technologies: Technology[]) => void;
}

export function TechnologySelector({ selectedTechnologies, onChange }: TechnologySelectorProps) {
  const [query, setQuery] = useState('');
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await fetch('/api/technologies');
        const data = await response.json();
        setTechnologies(data);
      } catch (error) {
        console.error('Failed to fetch technologies:', error);
        // Fallback to empty array if API fails
        setTechnologies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  const filteredTechnologies = query === ''
    ? technologies
    : technologies.filter((tech) =>
        tech.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      );

  // Check if query could be a new technology
  const queryAsTechnology = query.trim();
  const showAddCustom = queryAsTechnology.length > 0 && 
    !filteredTechnologies.some(tech => 
      tech.name.toLowerCase() === queryAsTechnology.toLowerCase()
    );

  const removeTechnology = (techToRemove: Technology) => {
    onChange(selectedTechnologies.filter(tech => tech.id !== techToRemove.id));
  };

  const addTechnology = (techToAdd: Technology | string | null) => {
    if (!techToAdd) return;
    
    if (typeof techToAdd === 'string') {
      // Create a new technology object for custom entry
      const newTech: Technology = {
        id: `custom-${techToAdd.toLowerCase().replace(/\s+/g, '-')}`,
        name: techToAdd
      };
      if (!selectedTechnologies.find(tech => tech.name.toLowerCase() === newTech.name.toLowerCase())) {
        onChange([...selectedTechnologies, newTech]);
      }
    } else {
      if (!selectedTechnologies.find(tech => tech.id === techToAdd.id)) {
        onChange([...selectedTechnologies, techToAdd]);
      }
    }
    setQuery('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Select Technologies
      </label>
      <div className="relative">
        <Combobox value={null} onChange={addTechnology as (value: Technology | string | null) => void}>
          <div className="relative">
            <Combobox.Input
              className="w-full h-10 px-4 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700 focus:border-gray-200 dark:focus:border-gray-700"
              placeholder={isLoading ? "Loading technologies..." : "Search or enter new technology..."}
              onChange={(event) => setQuery(event.target.value)}
              displayValue={() => query}
            />
            <Combobox.Options className="absolute z-10 w-full mt-1 overflow-auto bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none p-1">
              {isLoading ? (
                <div className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300">
                  Loading technologies...
                </div>
              ) : filteredTechnologies.length === 0 && query !== '' ? (
                <Combobox.Option
                  value={queryAsTechnology}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-3 mb-0.5 rounded-md ${
                      active
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-white'
                    }`
                  }
                >
                  Add &quot;{queryAsTechnology}&quot; as new technology
                </Combobox.Option>
              ) : (
                <>
                  {filteredTechnologies.map((tech) => (
                    <Combobox.Option
                      key={tech.id}
                      value={tech}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 px-3 mb-0.5 rounded-md ${
                          active
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                            : 'text-gray-900 dark:text-white'
                        }`
                      }
                    >
                      {tech.name}
                    </Combobox.Option>
                  ))}
                  {showAddCustom && (
                    <Combobox.Option
                      value={queryAsTechnology}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 px-3 mb-0.5 rounded-md ${
                          active
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            : 'text-gray-900 dark:text-white'
                        }`
                      }
                    >
                      Add &quot;{queryAsTechnology}&quot; as new technology
                    </Combobox.Option>
                  )}
                </>
              )}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTechnologies.map((tech) => (
          <span
            key={tech.id}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
          >
            {tech.name}
            <button
              type="button"
              onClick={() => removeTechnology(tech)}
              className="ml-1 focus:outline-none cursor-pointer"
            >
              <XCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
} 