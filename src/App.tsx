import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './layout/homepage/homepage';
import NavbarComponent from './components/navbar/navbar';
import UserProfilePage from './layout/user-profile/user-profile';
import EditProfile from './layout/user-profile/edit-profile/edit-profile';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="App h-screen flex flex-col">
        <div className="w-full">
          <NavbarComponent />
        </div>
        <div className="flex-1 bg-gray-200 p-4 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
