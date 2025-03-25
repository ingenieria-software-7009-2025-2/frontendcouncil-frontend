import { createBrowserRouter, NavigateFunction } from 'react-router-dom';
import App from '../App';
import HomePage from '../layout/homepage/homepage'; 
import UserProfilePage from '../layout/user-profile/user-profile';

// Configuración de rutas
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        //path: '/profile/:userId',
        path: '/profile',
        element: <UserProfilePage />,
      }
      // Aquí van todas las rutas que vamos a manejar
    ],
  },
]);

// Función para navegación programática
export class NavigationService {
  private static navigate: NavigateFunction | null = null;

  static setNavigate(navigate: NavigateFunction) {
    NavigationService.navigate = navigate;
  }

  static goToProfile() {
    if (NavigationService.navigate) {
      NavigationService.navigate(`/profile`);
    }
  }
  /**
   *  MODIFICAR PARA QUE FUNCIONE CON LOS ID'S
    static goToProfile(userId: string) {
    if (NavigationService.navigate) {
      NavigationService.navigate(`/profile/${userId}`);
    }
  }*/
}