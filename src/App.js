import React from 'react';
import MLWorkflow from './components/MLWorkflow';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <MLWorkflow />
      </div>
    </div>
  );
}

export default App;