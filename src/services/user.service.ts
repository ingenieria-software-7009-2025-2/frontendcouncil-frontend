import { UserDTO } from "../models/dto-user";

export class UserService {
  private static apiUrl = 'http://localhost:8080/v1/users';
  private static mockUsers: UserDTO[] = [ ];

  private static listeners: ((users: UserDTO[]) => void)[] = [];
  private static intervalId: number | null = null;

  static async connect(): Promise<void> {
    await this.fetchAndNotify();
    this.intervalId = window.setInterval(() => {
      this.fetchAndNotify();
    }, 5000);
  }

  private static async fetchAndNotify() {
    try {
      const users = await this.fetchUsers();
      this.notifyListeners(users);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  }

  static subscribe(callback: (users: UserDTO[]) => void): void {
    this.listeners.push(callback);
    this.fetchAndNotify();
  }

  static unsubscribe(callback: (users: UserDTO[]) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  static disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private static notifyListeners(users: UserDTO[]): void {
    this.listeners.forEach(listener => listener(users));
  }

  static async fetchUsers(): Promise<UserDTO[]> {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${this.apiUrl}/toolkit`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los usuarios");
    }
    return await response.json();
  }

  static async updateUserRole(username: string, newRole: string): Promise<boolean> {
    try {
      const token = sessionStorage.getItem("token");
      const request = {
        username: username,
        rolid: newRole
      };

      const response = await fetch(`${this.apiUrl}/toolkit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error("No se pudo cambiar el rol");
      }

      // Actualizar datos locales si es necesario
      const users = await this.fetchUsers();
      this.notifyListeners(users);
      
      return true;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      return false;
    }
  }

  static async deleteUser(userId: number): Promise<boolean> {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${this.apiUrl}/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el usuario");
      }

      // Actualizar datos locales si es necesario
      const users = await this.fetchUsers();
      this.notifyListeners(users);
      
      return true;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return false;
    }
  }

  public static async getCurrentUser(): Promise<UserDTO> {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token disponible");
    }

    const response = await fetch(`${this.apiUrl}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    this.storeUserData(data);
    return data;
  }

  private static storeUserData(userData: UserDTO): void {
    sessionStorage.setItem("correo", userData.correo);
    sessionStorage.setItem("nombre", userData.nombre);
    sessionStorage.setItem("apPaterno", userData.apPaterno || '');
    sessionStorage.setItem("apMaterno", userData.apMaterno || '');
    sessionStorage.setItem("userName", userData.userName);
    sessionStorage.setItem("userId", String(userData.clienteid));
  }
}