import React from 'react';
import MLWorkflow from './components/MLWorkflow';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <MLWorkflow />
    </div>
  );
}

export default App;