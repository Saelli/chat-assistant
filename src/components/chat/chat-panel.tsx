'use client';

import { useState, useTransition } from 'react';
import type { Message } from '@/lib/types';
import { submitUserMessage } from '@/app/actions';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { FaqSection } from './faq-section';
import { HumanForm } from './human-form';

const initialMessages: Message[] = [
  {
    id: '0',
    role: 'assistant',
    content:
      "Hello! I'm your AI assistant. How can I help you today? You can ask me about website creation, API services, or check out some common questions below.",
  },
];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isPending, startTransition] = useTransition();
  const [showFaq, setShowFaq] = useState(true);

  const handleSubmit = (value: string) => {
    if (showFaq) {
      setShowFaq(false);
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: value,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    startTransition(async () => {
      const aiMessage = await submitUserMessage(newMessages, value);
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    });
  };
  
  const handleBack = () => {
    const cancelMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Ok, let's go back. How can I help you?",
    };
    setMessages(prev => [...prev, cancelMessage]);
  };

  const lastMessage = messages[messages.length - 1];

  if (lastMessage?.component === 'human-form') {
    return <HumanForm onBack={handleBack} />;
  }

  return (
    <div className="flex flex-col h-full">
      <ChatMessages messages={messages} isLoading={isPending} />

      {showFaq && <FaqSection />}
      
      <ChatInput onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}
