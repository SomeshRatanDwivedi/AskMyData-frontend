
import React, {useRef, useEffect, memo } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

import useChat from '@/hooks/useChat';
import Loader from './Loader';

const ChatView: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const {
    messages,
    isLoading,
    getHistory,
    sendMessage,
    regenerate,
    removeMessage
  } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    getHistory();
  }, [getHistory])

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {
        isLoading ? <Loader /> : <>
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-3xl">
              <div className="space-y-8">
                {messages.map((msg, ind) => (
                  <ChatMessage key={ind} message={msg} refreshChatHistory={removeMessage} regenarateMessage={regenerate} />
                ))}
              </div>
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="shrink-0 p-4 md:px-8 bg-white">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default memo(ChatView);