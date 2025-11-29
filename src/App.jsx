import React from 'react';
import TimeTable from './TimeTable';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>時間割</h1>
      </header>
      <main>
        <TimeTable />
      </main>
    </div>
  );
}

export default App;
