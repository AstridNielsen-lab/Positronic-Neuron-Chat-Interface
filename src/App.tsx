import React, { useState, useEffect } from 'react';
import { Send, Loader, Brain, Phone, Globe, Mail } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow max-w-4xl mx-auto p-4 w-full">
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

      <footer className="bg-gray-800 text-white py-8 mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold">Like Look Solutions</h3>
              </div>
              <p className="text-gray-300">
                Desenvolvendo soluções inovadoras em Inteligência Artificial e Neurônios Positrônicos
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Contato</h3>
              <div className="space-y-2">
                <a 
                  href="tel:+5511970603441" 
                  className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>+55 11 97060-3441</span>
                </a>
                <a 
                  href="https://likelook.wixsite.com/solutions" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>Website</span>
                </a>
                <a 
                  href="https://wa.me/5511970603441" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Desenvolvedor</h3>
              <p className="text-gray-300">
                Julio Campos Machado
              </p>
              <p className="text-gray-300">
                Especialista em Inteligência Artificial e Desenvolvimento de Software
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Like Look Solutions. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;