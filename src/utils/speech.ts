export class SpeechService {
  private static instance: SpeechService;
  private synthesis: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;

  private constructor() {
    this.synthesis = window.speechSynthesis;
    this.setPortugueseVoice();
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  private setPortugueseVoice() {
    // Aguarda as vozes serem carregadas
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = this.synthesis.getVoices();
      // Procura por uma voz em português
      this.voice = voices.find(voice => 
        voice.lang.includes('pt') || 
        voice.lang.includes('PT')
      ) || voices[0]; // Usa a primeira voz como fallback
    };
  }

  public speak(text: string) {
    // Cancela qualquer fala em andamento
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'pt-BR';

    this.synthesis.speak(utterance);
  }

  public stop() {
    this.synthesis.cancel();
  }
}