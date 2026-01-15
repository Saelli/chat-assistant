export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  component?: 'human-form' | null;
};
