
import React from 'react';
import {
  BrainIcon,
  ChevronUpIcon,
  ClipboardIcon,
  EditIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  ThumbsDownIcon,
  BotIcon
} from './Icons';
import type { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

const ThinkingBlock: React.FC = () => (
  <div className="flex flex-col space-y-3 p-4 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-600">
    <div className="flex justify-between items-center">
      <div className="flex items-center font-semibold">
        <BrainIcon className="w-5 h-5 mr-2" />
        <span>Ok, let's figure this out:</span>
      </div>
      <ChevronUpIcon className="w-5 h-5" />
    </div>
    <p>Thinking...</p>
    <p>Ok, I'm ready to generate my response:</p>
  </div>
);

const MessageActions: React.FC = () => (
  <div className="flex items-center space-x-3 text-gray-500 mt-3">
    <button className="hover:text-gray-800"><ClipboardIcon className="w-4 h-4" /></button>
    <button className="hover:text-gray-800"><EditIcon className="w-4 h-4" /></button>
    <button className="hover:text-gray-800"><RefreshCwIcon className="w-4 h-4" /></button>
    <button className="hover:text-gray-800"><ThumbsDownIcon className="w-4 h-4" /></button>
    <button className="hover:text-gray-800"><MoreHorizontalIcon className="w-4 h-4" /></button>
  </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const Avatar: React.FC = () => {
    if (isUser) {
      return (
        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-600 shrink-0">
          U
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
        <BotIcon className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="flex items-start space-x-4">
      <Avatar />
      <div className="flex-1">
        {isUser ? (
          <p className="font-semibold text-gray-800">{message.content}</p>
        ) : (
          <div className="space-y-4">
            {message.isThinking && <ThinkingBlock />}
            {message.content ? (
              <div className="prose max-w-none text-gray-800">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className={line.trim() === '' ? 'h-4' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            )}

            {!message.isThinking && message.content && <MessageActions />}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
