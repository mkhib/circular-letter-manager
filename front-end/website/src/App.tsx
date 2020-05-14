import React from 'react';
import logo from './logo.svg';
import './App.css';
import AuthRouter from './components/AuthRouter';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <AuthRouter />
      </header>
    </div>
  );
}

export default App;
