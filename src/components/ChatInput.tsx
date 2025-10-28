
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, MicIcon, BotIcon, GridIcon } from './Icons';

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
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything to Jazper"
          className="w-full pl-0 pr-20 border-0 focus:ring-0 resize-none bg-transparent placeholder-gray-400"
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="p-2 rounded-md bg-gray-700 text-white disabled:bg-gray-200 disabled:text-gray-400 hover:bg-gray-900 transition-colors"
          >
            <SendIcon className="w-5 h-5 -rotate-45" />
          </button>
          <button type="button" className="p-2 rounded-md text-gray-500 hover:bg-gray-100">
            <MicIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-2">
        <button type="button" className="flex items-center px-2 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-100">
          <span className="border border-gray-400 w-4 h-4 inline-block mr-2"></span>
        </button>
        <button type="button" className="flex items-center px-2 py-1 rounded-md border border-gray-300 text-sm font-semibold hover:bg-gray-100">
          T
        </button>
        <button type="button" className="flex items-center px-2 py-1 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-100">
          <BotIcon className="w-4 h-4 mr-1.5" />
          <span>claude-3.7-sonnet-8b:latest</span>
        </button>
        <button type="button" className="flex items-center px-2 py-1 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-100">
          <GridIcon className="w-4 h-4 mr-1.5" />
          <span>Workspaces</span>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
