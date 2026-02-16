import React from 'react';
import ReactDOM from 'react-dom/client';
import ProblemComponent from './ProblemComponent';
import FixedComponent from './FixedComponent';

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>PDF Generation Debugging</h1>

      <div style={{ marginBottom: '40px' }}>
        <h2>Problem: Ref only captures left panel</h2>
        <ProblemComponent />
      </div>

      <hr />

      <div style={{ marginTop: '40px' }}>
        <h2>Solution: Ref wraps both panels</h2>
        <FixedComponent />
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
