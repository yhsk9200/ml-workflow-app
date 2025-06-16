import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';

import DataInputNode from './nodes/DataInputNode';
import PreprocessingNode from './nodes/PreprocessingNode';
import ModelNode from './nodes/ModelNode';
import EvaluationNode from './nodes/EvaluationNode';

import 'reactflow/dist/style.css';

const nodeTypes = {
  dataInput: DataInputNode,
  preprocessing: PreprocessingNode,
  model: ModelNode,
  evaluation: EvaluationNode,
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
];

const initialEdges = [];

// 노드 타입별 기본 데이터 정의
const getNodeData = (nodeType) => {
  const nodeDataMap = {
    dataInput: {
      label: 'Data Input',
      description: 'Load dataset'
    },
    preprocessing: {
      label: 'Data Preprocessing', 
      description: 'Clean and transform data'
    },
    model: {
      label: 'ML Model',
      description: 'Train machine learning model'
    },
    evaluation: {
      label: 'Model Evaluation',
      description: 'Evaluate model performance'
    }
  };
  
  return nodeDataMap[nodeType] || { label: 'Unknown', description: '' };
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function MLWorkflowCanvas() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    console.log('Drag over detected'); // 디버깅용
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      console.log('Drop event triggered'); // 디버깅용

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      
      console.log('Dropped node type:', type); // 디버깅용

      // 유효하지 않은 타입이면 리턴
      if (typeof type === 'undefined' || !type) {
        console.log('Invalid node type'); // 디버깅용
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      console.log('New node position:', position); // 디버깅용

      const newNode = {
        id: getId(),
        type,
        position,
        data: getNodeData(type),
      };

      console.log('Creating new node:', newNode); // 디버깅용
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, screenToFlowPosition, setNodes]
  );

  const onInit = useCallback((reactFlowInstance) => {
    console.log('ReactFlow initialized'); // 디버깅용
    setReactFlowInstance(reactFlowInstance);
  }, []);

  return (
    <div 
      className="flex-1" 
      ref={reactFlowWrapper}
      style={{ width: '100%', height: '100vh' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
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

// ReactFlowProvider로 감싸서 내보내기
export default function MLWorkflow() {
  return (
    <ReactFlowProvider>
      <MLWorkflowCanvas />
    </ReactFlowProvider>
  );
}