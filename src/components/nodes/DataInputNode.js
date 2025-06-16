import React from 'react';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';

export default function DataInputNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-blue-100 border-2 border-blue-300">
      <div className="flex items-center">
        <Database className="w-4 h-4 mr-2" />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">{data.description}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}