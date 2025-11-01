
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { SendHorizonalIcon } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSendMessage(prompt);
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-300 rounded-lg p-3 shadow-sm bg-white">
      <div className="relative">
        <div className="flex items-center w-full gap-2">
          <Textarea ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="focus:ring-0 resize-none bg-transparent placeholder-gray-400"
            rows={1}
            disabled={isLoading}
          />
          <Button variant="outline" size="icon" aria-label="Submit">
            <SendHorizonalIcon size="90" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
