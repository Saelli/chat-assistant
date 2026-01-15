'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import { Chat } from './chat';
import { cn } from '@/lib/utils';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <div
        className={cn(
          'mb-4 w-[calc(100vw-48px)] max-w-sm sm:w-[400px]',
          'transition-all duration-300 ease-in-out',
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10 pointer-events-none'
        )}
        aria-hidden={!isOpen}
      >
        <Chat />
      </div>
      <Button
        size="lg"
        className="rounded-full w-16 h-16 shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground p-0"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
      </Button>
    </div>
  );
}
