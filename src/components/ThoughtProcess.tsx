import React from 'react';
import { ThoughtResponse } from '../types';
import { Brain, Volume2, VolumeX } from 'lucide-react';
import { SpeechService } from '../utils/speech';

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
  const [speakingIndex, setSpeakingIndex] = React.useState<number | null>(null);
  const speechService = SpeechService.getInstance();

  const handleSpeak = (content: string, index: number) => {
    if (speakingIndex === index) {
      speechService.stop();
      setSpeakingIndex(null);
    } else {
      speechService.stop();
      speechService.speak(content);
      setSpeakingIndex(index);
    }
  };

  React.useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">{thoughtTypeLabels[thought.type]}</h3>
            </div>
            <button
              onClick={() => handleSpeak(thought.content, index)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={speakingIndex === index ? "Parar leitura" : "Ler resposta"}
            >
              {speakingIndex === index ? (
                <VolumeX className="w-5 h-5 text-blue-500" />
              ) : (
                <Volume2 className="w-5 h-5 text-blue-500" />
              )}
            </button>
          </div>
          <p className="text-gray-700">{thought.content}</p>
        </div>
      ))}
    </div>
  );
}