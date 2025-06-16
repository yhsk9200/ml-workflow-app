import React from 'react';
import { Handle, Position } from 'reactflow';

const getSourceIcon = (sourceType) => {
  switch (sourceType) {
    case 'fileUpload':
      return '📄'; // File icon
    case 'dbConnection':
      return '🗄️'; // Database icon
    case 'filePath':
    default:
      return '📁'; // Folder icon for file path
  }
};

export default function DataInputNode({ data }) {
  return (
    <div className="w-48 shadow-lg rounded-md overflow-hidden bg-white border-2 border-indigo-500">
      <div className="p-2 bg-indigo-500 text-white text-sm">
        Data Input
      </div>
      <div className="p-3">
        <div className="flex items-center">
          <div className="text-3xl mr-3">{getSourceIcon(data.sourceType)}</div>
          <div>
            <div className="text-sm font-bold text-gray-800">{data.label}</div>
            <p className="text-xs text-gray-500">{data.description}</p>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-indigo-500" />
    </div>
  );
}