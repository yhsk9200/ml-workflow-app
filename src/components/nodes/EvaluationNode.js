import React from 'react';
import { Handle, Position } from 'reactflow';
import { BarChart3 } from 'lucide-react';

export default function EvaluationNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-orange-100 border-2 border-orange-300">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center">
        <BarChart3 className="w-4 h-4 mr-2" />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">{data.description}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}