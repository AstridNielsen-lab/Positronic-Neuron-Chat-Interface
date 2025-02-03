import React, { useState, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import { generateThought } from './api';
import { ThoughtProcess } from './components/ThoughtProcess';
import { ChatMessage, ThoughtResponse } from './types';
import { SpeechService } from './utils/speech';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const speechService = SpeechService.getInstance();

  useEffect(() => {
    // Inicializa o serviço de voz
    SpeechService.getInstance();
  }, []);

  const processThoughts = async (userMessage: string) => {
    setIsProcessing(true);
    const thoughtTypes = ['concrete', 'abstract', 'critical', 'intuitive', 'reflective'];
    const thoughts: ThoughtResponse[] = [];

    for (const type of thoughtTypes) {
      const response = await generateThought(userMessage, type);
      thoughts.push({
        type: type as ThoughtResponse['type'],
        content: response
      });
    }

    // Lê automaticamente a resposta final (pensamento reflexivo)
    const finalResponse = thoughts[thoughts.length - 1].content;
    speechService.speak(finalResponse);

    setMessages(prev => [...prev, 
      { role: 'user', content: userMessage },
      { role: 'assistant', content: finalResponse, thoughts }
    ]);
    setIsProcessing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userInput = input;
    setInput('');
    await processThoughts(userInput);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Chat de Rede Neural Positrônica</h1>
          <p className="text-gray-600">Experimente a evolução do pensamento através das fases neurais</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="space-y-4 mb-4 max-h-[600px] overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-l-lg rounded-br-lg' 
                    : 'bg-gray-100 text-gray-800 rounded-r-lg rounded-bl-lg'
                } p-4`}>
                  <p>{message.content}</p>
                </div>
                {message.thoughts && <ThoughtProcess thoughts={message.thoughts} />}
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processando fases neurais...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Faça uma pergunta sobre neurônios positrônicos..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;