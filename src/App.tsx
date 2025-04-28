import { useEffect, useState } from 'react';
import './style.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './layout/homepage/homepage';
import NavbarComponent from './components/navbar/navbar';
import UserProfilePage from './layout/user-profile/user-profile';
import EditProfile from './layout/user-profile/edit-profile/edit-profile';
import JoinTeam from './layout/user-profile/join-team/join-team';
import ManageIncidents from './layout/admin-panel/manage-incidents.tsx/manage-incidents';
import ManageUsers from './layout/admin-panel/manage-users/manage-users';
import NotFoundPage from './layout/page-not-found/page-not-found';
import ProtectedRoute from './routes/protected-route';

function App() {
  const [count, setCount] = useState(0);  
  
  // Si se cierra la venta se cierra sesión 
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Podríamos implementar la del backend pero esto sirve
      localStorage.removeItem('authToken');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Router>
      <div className="App h-screen flex flex-col">
        <div className="w-full">
          <NavbarComponent />
        </div>
        <div className="flex-1 bg-gray-200 p-4 ">
          <Routes>
            <Route path="/" element={<HomePage />} />
  
            <Route path="/profile" element={
              <ProtectedRoute isAuth={!!localStorage.getItem('authToken')}>
                <UserProfilePage />
              </ProtectedRoute>
            } />

            <Route path="/edit-profile" element={
              <ProtectedRoute isAuth={!!localStorage.getItem('authToken')}>
                <EditProfile />
              </ProtectedRoute>
            } />

            <Route path="/join-team" element={
              <ProtectedRoute isAuth={!!localStorage.getItem('authToken')}>
                <JoinTeam />
              </ProtectedRoute>
            } />

            <Route path="/manage-incidents" element={
              <ProtectedRoute isAuth={!!localStorage.getItem('authToken')}>
                <ManageIncidents />
              </ProtectedRoute>
            } />

            <Route path="/manage-users" element={
              <ProtectedRoute isAuth={!!localStorage.getItem('authToken')}>
                <ManageUsers />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
