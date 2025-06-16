import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import DataInputNode from './nodes/DataInputNode';
import PreprocessingNode from './nodes/PreprocessingNode';
import ModelNode from './nodes/ModelNode';

import 'reactflow/dist/style.css';

const nodeTypes = {
  dataInput: DataInputNode,
  preprocessing: PreprocessingNode,
  model: ModelNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'dataInput',
    data: { 
      label: 'Data Input',
      description: 'Load dataset'
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    type: 'preprocessing',
    data: { 
      label: 'Data Preprocessing',
      description: 'Clean and transform data'
    },
    position: { x: 400, y: 100 },
  },
  {
    id: '3',
    type: 'model',
    data: { 
      label: 'ML Model',
      description: 'Train machine learning model'
    },
    position: { x: 700, y: 100 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function MLWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}