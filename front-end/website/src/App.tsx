import React from 'react';
import logo from './logo.svg';
import './App.css';
import AuthRouter from './components/AuthRouter';
document.title = "سامانه بخشنامه"

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
