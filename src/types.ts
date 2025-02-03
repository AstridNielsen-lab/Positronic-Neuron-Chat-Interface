export interface ThoughtResponse {
  type: 'concrete' | 'abstract' | 'critical' | 'intuitive' | 'reflective';
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  thoughts?: ThoughtResponse[];
}