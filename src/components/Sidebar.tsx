
import React from 'react';
import { GridIcon, PlusIcon } from './Icons';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 flex flex-col">
      <h1 className="text-2xl font-bold mb-4 bg-white px-4 py-2">AskMyData</h1>
      <div className="p-4 flex-1 flex flex-col space-y-2 bg-white">
        <button className="flex items-center p-2 rounded-md bg-red-100 text-red-700 border border-red-500 font-semibold">
          <GridIcon className="w-5 h-5 mr-3" />
          <span>FutureBridge Platf...</span>
        </button>
        <div className="pl-4">
          <button className="w-full text-left p-2 rounded-md text-sm hover:bg-gray-200">
            default
          </button>
        </div>
        <button className="flex items-center p-2 rounded-md border border-gray-300 hover:bg-gray-100">
          <PlusIcon className="w-5 h-5 mr-3" />
          <span>New Thread</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
