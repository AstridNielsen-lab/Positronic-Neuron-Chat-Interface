import React from 'react';
import { ThoughtResponse } from '../types';
import { Brain } from 'lucide-react';

interface ThoughtProcessProps {
  thoughts: ThoughtResponse[];
}

const thoughtTypeLabels = {
  concrete: 'Pensamento Concreto',
  abstract: 'Pensamento Abstrato',
  critical: 'Pensamento Crítico',
  intuitive: 'Pensamento Intuitivo',
  reflective: 'Pensamento Reflexivo'
};

export function ThoughtProcess({ thoughts }: ThoughtProcessProps) {
  return (
    <div className="space-y-4 mt-4">
      {thoughts.map((thought, index) => (
        <div 
          key={thought.type}
          className="bg-white rounded-lg p-4 shadow-md transition-all duration-300"
          style={{ 
            opacity: 1,
            transform: `translateY(0)`,
            animation: `fadeIn 0.5s ease-out ${index * 0.2}s`
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">{thoughtTypeLabels[thought.type]}</h3>
          </div>
          <p className="text-gray-700">{thought.content}</p>
        </div>
      ))}
    </div>
  );
}