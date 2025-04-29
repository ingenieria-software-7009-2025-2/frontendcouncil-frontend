import {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import NavbarComponent from "./components/navbar/navbar.tsx";
import HomePage from "./layout/homepage/homepage.tsx";
import UserProfilePage from "./layout/user-profile/user-profile.tsx";
import EditProfile from "./layout/user-profile/edit-profile/edit-profile.tsx";
import JoinTeam from "./layout/user-profile/join-team/join-team.tsx";
import NotFoundPage from "./layout/page-not-found/page-not-found.tsx";
import ManageIncidents from "./layout/admin-panel/manage-incidents.tsx/manage-incidents.tsx";
import ManageUsers from "./layout/admin-panel/manage-users/manage-users.tsx";

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
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/join-team" element={<JoinTeam />} />
              <Route path="/*" element={<NotFoundPage />} />
              <Route path="/manage-incidents" element={<ManageIncidents />} />
              <Route path="/manage-users" element={<ManageUsers />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
