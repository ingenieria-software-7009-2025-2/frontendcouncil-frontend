import { useState } from 'react';
import './App.css';
import HomePage from './layout/homepage/homepage';
import NavbarComponent from './components/navbar/navbar';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App h-screen flex flex-col">
      <div className="w-full">
        <NavbarComponent />
      </div>
      <div className="flex-1 bg-gray-200 p-4 overflow-y-auto">
        <HomePage />
      </div>
    </div>
  );
}

export default App;
