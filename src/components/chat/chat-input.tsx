'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';
import { useRef } from 'react';

interface ChatInputProps {
  onSubmit: (value: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = inputRef.current?.value;
    if (value) {
      onSubmit(value);
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex items-center gap-4 p-4 border-t"
    >
      <Input
        ref={inputRef}
        placeholder="Type your message..."
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" size="icon" disabled={isLoading}>
        <SendHorizonal className="h-5 w-5" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}
