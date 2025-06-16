import React from 'react';
import { Handle, Position } from 'reactflow';
import { Brain } from 'lucide-react';

export default function ModelNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-purple-100 border-2 border-purple-300">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center">
        <Brain className="w-4 h-4 mr-2" />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">{data.description}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}