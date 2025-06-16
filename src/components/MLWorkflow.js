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
  MarkerType,
} from 'reactflow';

import DataInputNode from './nodes/DataInputNode';
import PreprocessingNode from './nodes/PreprocessingNode';
import ModelNode from './nodes/ModelNode';
import EvaluationNode from './nodes/EvaluationNode';
import AttributePanel from './AttributePanel';

import 'reactflow/dist/style.css';

const nodeTypes = {
  dataInput: DataInputNode,
  preprocessing: PreprocessingNode,
  model: ModelNode,
  evaluation: EvaluationNode,
};

const defaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: '#a1a1aa' },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#a1a1aa',
  },
};

const initialNodes = [
  {
    id: '1',
    type: 'dataInput',
    data: {
      label: 'Data Input',
      description: 'Load dataset',
      sourceType: 'filePath',
      filePath: '/path/to/data.csv',
      uploadedFileName: null,
      dbType: 'PostgreSQL',
      dbHost: 'localhost',
      dbPort: '5432',
      dbUser: 'admin',
      dbPassword: '',
      dbName: 'mydatabase',
    },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];

const getNodeData = (nodeType) => {
  const nodeDataMap = {
    dataInput: {
      label: 'Data Input',
      description: 'Load dataset',
      sourceType: 'filePath',
      filePath: '/path/to/data.csv',
      uploadedFileName: null,
      dbType: 'PostgreSQL',
      dbHost: 'localhost',
      dbPort: '5432',
      dbUser: 'admin',
      dbPassword: '',
      dbName: 'mydatabase',
    },
    preprocessing: {
      label: 'Data Preprocessing',
      description: 'Clean and transform data',
      method: 'StandardScaler',
    },
    model: {
      label: 'ML Model',
      description: 'Train machine learning model',
      algorithm: 'LogisticRegression',
      hyperparameters: '{ "C": 1.0 }',
    },
    evaluation: {
      label: 'Model Evaluation',
      description: 'Evaluate model performance',
      metric: 'Accuracy',
    }
  };

  return nodeDataMap[nodeType] || { label: 'Unknown', description: '' };
};

let id = 2;
const getId = () => `dndnode_${id++}`;

function MLWorkflowCanvas() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null); // 선택된 엣지 상태 추가
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;
      
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: getNodeData(type),
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );
  
  // --- 수정된 핸들러 ---
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setSelectedEdge(null); // 노드 클릭 시 엣지 선택 해제
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null); // 엣지 클릭 시 노드 선택 해제
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);
  
  // --- 에러 해결: 'removeEdges' 대신 filter 사용 ---
  const deleteSelectedEdge = useCallback(() => {
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
  }, [selectedEdge, setEdges]);
  // --- 여기까지 ---

  const onNodeDataChange = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
    if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode((prevNode) => ({
            ...prevNode,
            data: {
            ...prevNode.data,
            ...newData,
            },
        }));
    }
  };

  return (
    <div className="flex flex-1 h-full">
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick} // 엣지 클릭 핸들러 추가
          onPaneClick={onPaneClick} // 캔버스 클릭 핸들러 추가
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      <AttributePanel
        selectedNode={selectedNode}
        selectedEdge={selectedEdge} // 선택된 엣지 정보 전달
        onNodeDataChange={onNodeDataChange}
        onEdgeDelete={deleteSelectedEdge} // 엣지 삭제 함수 전달
      />
    </div>
  );
}

export default function MLWorkflow() {
  return (
    <ReactFlowProvider>
      <MLWorkflowCanvas />
    </ReactFlowProvider>
  );
}
