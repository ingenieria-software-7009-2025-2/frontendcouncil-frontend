import { UserDTO } from "../models/dto-user";
import { backendcouncil_api } from "../shared/backendcouncil-api";
import { z } from "zod";

const UserSchema = z.object({
    username: z.string(),
    nombre: z.string(),
    apPaterno: z.string(),
    apMaterno: z.string(),
    correo: z.string().email(),
  });
  
  export class UserService {
    private static async request<T>(
      endpoint: string,
      method: string,
      body?: any,
      requiresAuth: boolean = true
    ): Promise<T> {
      const url = `${backendcouncil_api}${endpoint}`;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
  
      if (requiresAuth) {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }
        headers["Authorization"] = `Bearer ${token}`;
      }
  
      try {
        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Error ${response.status}: ${response.statusText}`
          );
        }
  
        if (response.status === 204) {
          return null as unknown as T;
        }
  
        return response.json();
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      }
    }
  
    static async register(user: Omit<UserDTO, "password"> & { password: string }): Promise<UserDTO> {
      const response = await this.request<UserDTO>("/", "POST", user, false);
      return UserSchema.parse(response);
    }
  
    static async login(email: string, password: string): Promise<{ user: UserDTO; token: string }> {
        const response = await this.request<{ user: UserDTO; token: string }>(
          "/login",
          "POST",
          { correo: email, password },
          false
        );
        
        // Validamos que la respuesta tenga la estructura esperada
        if (!response.user || !response.token) {
          throw new Error("Respuesta del servidor inválida");
        }
        
        return response;
      }
  
    static async getCurrentUser(): Promise<UserDTO> {
      const response = await this.request<UserDTO>("/me", "GET");
      return UserSchema.parse(response);
    }
  
    static async updateUser(userData: Partial<UserDTO>): Promise<UserDTO> {
      const response = await this.request<UserDTO>("/me", "PUT", userData);
      return UserSchema.parse(response);
    }
  
    static async logout(): Promise<void> {
      await this.request<void>("/logout", "POST");
    }
  
    static async getAllUsers(): Promise<UserDTO[]> {
      const response = await this.request<UserDTO[]>("/", "GET");
      return z.array(UserSchema).parse(response);
    }
  }
