import React from 'react';
import { Database, Settings, Brain, BarChart3 } from 'lucide-react';

const nodeTypes = [
  { type: 'dataInput', label: 'Data Input', icon: Database, color: 'bg-blue-100' },
  { type: 'preprocessing', label: 'Preprocessing', icon: Settings, color: 'bg-green-100' },
  { type: 'model', label: 'ML Model', icon: Brain, color: 'bg-purple-100' },
  { type: 'evaluation', label: 'Evaluation', icon: BarChart3, color: 'bg-orange-100' },
];

export default function Sidebar() {
  const onDragStart = (event, nodeType) => {
    console.log('Drag start:', nodeType); // 디버깅용
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = (event) => {
    console.log('Drag end'); // 디버깅용
  };

  return (
    <aside className="w-64 bg-gray-100 p-4 border-r">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">ML/DL Components</h2>
        <p className="text-sm text-gray-600">Drag items to canvas</p>
      </div>
      
      <div className="space-y-2">
        {nodeTypes.map((node) => {
          const IconComponent = node.icon;
          return (
            <div
              key={node.type}
              className={`${node.color} p-3 rounded-md cursor-move border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors`}
              onDragStart={(event) => onDragStart(event, node.type)}
              onDragEnd={onDragEnd}
              draggable
            >
              <div className="flex items-center">
                <IconComponent className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{node.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}