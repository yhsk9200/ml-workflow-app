import React, { useState } from 'react';

const inputClass = "w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
const labelClass = "block text-sm font-medium text-gray-600 mb-1";

// DataInput 노드 전용 속성 컴포넌트
const DataInputAttributes = ({ data, onDataChange }) => {
  const [connectionStatus, setConnectionStatus] = useState({ state: 'idle', message: '' });
  const handleInputChange = (e) => onDataChange({ [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onDataChange({ uploadedFileName: e.target.files[0].name });
    }
  };
  const handleTestConnection = async () => {
    setConnectionStatus({ state: 'loading', message: 'Connecting...' });
    // This is a mock API call. You would need a real backend for this to work.
    await new Promise(resolve => setTimeout(resolve, 1000));
    setConnectionStatus({ state: 'success', message: 'Connection successful! (Mock)' });
  };

  return (
    <div>
      <label className={labelClass}>Data Source Type</label>
      <div className="flex items-center space-x-4 mb-4">
        {['filePath', 'fileUpload', 'dbConnection'].map(type => (
          <label key={type} className="flex items-center text-sm">
            <input
              type="radio" name="sourceType" value={type} checked={data.sourceType === type} onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
            <span className="ml-2 capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
          </label>
        ))}
      </div>
      {data.sourceType === 'filePath' && (
        <div>
          <label htmlFor="filePath" className={labelClass}>File Path</label>
          <input id="filePath" name="filePath" type="text" value={data.filePath || ''} onChange={handleInputChange} className={inputClass} />
        </div>
      )}
      {data.sourceType === 'fileUpload' && (
        <div>
          <label htmlFor="fileUpload" className={labelClass}>Upload File (.csv, .xlsx)</label>
          <input id="fileUpload" name="fileUpload" type="file" accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} className={`${inputClass} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100`} />
          {data.uploadedFileName && <p className="text-xs text-gray-500 mt-2">Selected: {data.uploadedFileName}</p>}
        </div>
      )}
      {data.sourceType === 'dbConnection' && (
        <div className="space-y-4 p-3 bg-gray-100 rounded-md">
            <div>
              <label htmlFor="dbType" className={labelClass}>Database Type</label>
              <select id="dbType" name="dbType" value={data.dbType} onChange={handleInputChange} className={inputClass}>
                <option>PostgreSQL</option><option>MySQL</option><option>MSSQL</option><option>SQLite</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div><label htmlFor="dbHost" className={labelClass}>Host</label><input id="dbHost" name="dbHost" type="text" value={data.dbHost} onChange={handleInputChange} className={inputClass}/></div>
                <div><label htmlFor="dbPort" className={labelClass}>Port</label><input id="dbPort" name="dbPort" type="text" value={data.dbPort} onChange={handleInputChange} className={inputClass}/></div>
            </div>
            <div><label htmlFor="dbName" className={labelClass}>Database</label><input id="dbName" name="dbName" type="text" value={data.dbName} onChange={handleInputChange} className={inputClass}/></div>
            <div><label htmlFor="dbUser" className={labelClass}>User</label><input id="dbUser" name="dbUser" type="text" value={data.dbUser} onChange={handleInputChange} className={inputClass}/></div>
            <div><label htmlFor="dbPassword" className={labelClass}>Password</label><input id="dbPassword" name="dbPassword" type="password" value={data.dbPassword} onChange={handleInputChange} className={inputClass}/></div>
            <div className="mt-4">
              <button onClick={handleTestConnection} disabled={connectionStatus.state === 'loading'} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
                {connectionStatus.state === 'loading' ? 'Testing...' : 'Test Connection'}
              </button>
              {connectionStatus.state !== 'idle' && (
                <p className={`mt-2 text-xs ${connectionStatus.state === 'success' ? 'text-green-600' : connectionStatus.state === 'error' ? 'text-red-600' : 'text-gray-500'}`}>{connectionStatus.message}</p>
              )}
            </div>
        </div>
      )}
    </div>
  );
};

// 메인 속성 패널 컴포넌트
export default function AttributePanel({ selectedNode, selectedEdge, onNodeDataChange, onEdgeDelete }) {
  const handleInputChange = (event) => {
    onNodeDataChange(selectedNode.id, { [event.target.name]: event.target.value });
  };

  // --- 추가된 부분: 엣지 선택 시 UI 렌더링 ---
  if (selectedEdge) {
    return (
      <aside className="w-80 bg-gray-50 p-6 border-l border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Connection Details</h3>
        <div className="space-y-4">
          <div className="text-sm bg-white p-3 rounded-md border border-gray-200">
            <p className="text-gray-500">From Node: <strong className="text-gray-800">{selectedEdge.source}</strong></p>
            <p className="text-gray-500">To Node: <strong className="text-gray-800">{selectedEdge.target}</strong></p>
          </div>
          <button
            onClick={onEdgeDelete}
            className="w-full flex items-center justify-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Connection
          </button>
          <p className="text-xs text-center text-gray-500">Or select the connection and press 'Delete' or 'Backspace'.</p>
        </div>
      </aside>
    );
  }
  // --- 여기까지 ---
  
  // --- 아래는 기존 노드 선택 시 UI 로직 ---
  const renderNodeSpecificAttributes = () => {
    if (!selectedNode) return null;
    const { type, data } = selectedNode;
    if (type === 'dataInput') return <DataInputAttributes data={data} onDataChange={(newData) => onNodeDataChange(selectedNode.id, newData)} />;
    
    switch (type) {
      case 'preprocessing': return (<div><label htmlFor="method" className={labelClass}>Method</label><select id="method" name="method" value={data.method || 'StandardScaler'} onChange={handleInputChange} className={inputClass}><option>StandardScaler</option><option>MinMaxScaler</option><option>RobustScaler</option><option>OneHotEncoder</option></select></div>);
      case 'model': return (<><div><label htmlFor="algorithm" className={labelClass}>Algorithm</label><select id="algorithm" name="algorithm" value={data.algorithm || 'LogisticRegression'} onChange={handleInputChange} className={inputClass}><option>LogisticRegression</option><option>SVM</option><option>DecisionTree</option><option>RandomForest</option></select></div><div className="mt-4"><label htmlFor="hyperparameters" className={labelClass}>Hyperparameters (JSON)</label><textarea id="hyperparameters" name="hyperparameters" value={data.hyperparameters || ''} onChange={handleInputChange} className={`${inputClass} font-mono`} rows="4"/></div></>);
      case 'evaluation': return (<div><label htmlFor="metric" className={labelClass}>Metric</label><select id="metric" name="metric" value={data.metric || 'Accuracy'} onChange={handleInputChange} className={inputClass}><option>Accuracy</option><option>Precision</option><option>Recall</option><option>F1-score</option><option>MSE</option><option>MAE</option></select></div>);
      default: return <p className="text-sm text-gray-500">No specific attributes for this node type.</p>;
    }
  };

  if (selectedNode) {
    return (
      <aside className="w-80 bg-gray-50 p-6 border-l border-gray-200 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Edit: {selectedNode.data.label}</h3>
        <div className="space-y-4">
          <div><label htmlFor="label" className={labelClass}>Label</label><input id="label" name="label" type="text" value={selectedNode.data.label} onChange={handleInputChange} className={inputClass}/></div>
          <div><label htmlFor="description" className={labelClass}>Description</label><textarea id="description" name="description" value={selectedNode.data.description} onChange={handleInputChange} className={inputClass} rows="3"/></div>
          <hr className="my-4"/>
          <h4 className="text-md font-semibold text-gray-700 mt-4">Type Specific Attributes</h4>
          {renderNodeSpecificAttributes()}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-gray-50 p-6 border-l border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700">Attributes</h3>
      <p className="mt-2 text-sm text-gray-500">Select a node or connection to view and edit its attributes.</p>
    </aside>
  );
}
