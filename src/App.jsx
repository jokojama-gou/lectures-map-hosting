import React from 'react';
import TimeTable from './TimeTable';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>授業マップ🗺️ （β版）by 横山豪</h1>
        <p>見たい授業マップ🗺️のコマをタップしてね！</p>
      </header>
      <main>
        <TimeTable />
      </main>
    </div>
  );
}

export default App;
