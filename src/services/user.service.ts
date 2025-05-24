import { UserDTO } from "../models/dto-user";
import { backendcouncil_api } from "../shared/backendcouncil-api";
import { z } from "zod";

/**
 * @global
 * Esquema de usuario.
 */
const UserSchema = z.object({
    username: z.string(),
    nombre: z.string(),
    apPaterno: z.string(),
    apMaterno: z.string(),
    correo: z.string().email(),
  });
  
  /**
   * @module user.service
   * 
   * @global
   * Módulo de servicio para usuarios.
   * 
   * @apicall *
   * 
   */
  export class UserService {
    /**
     * Solicitud a la API.
     * 
     * @apicall * (under request).
     * 
     * @param endpoint - Endpoint de la API.
     * @param method - Método HTTP.
     * @param body - Body a mandar.
     * @param requiresAuth - Referencia a si se requiere authorization.
     * @returns {Promise<T>} Representación del terminado con éxito de una operación asíncrona. junto con resultado.
     */
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
        const token = sessionStorage.getItem("authToken");
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
  
    /**
     * Registro.
     * 
     * @apicall POST - `http:localhost:8080/v1/users`
     * 
     * @param {Omit<UserDTO, string>} user - Usuario sin contraseña.
     * @param {string} password - Contraseña asociada.
     * 
     * @returns {Promise<UserDTO>} Representación del terminado con éxito de una operación asíncrona, con resultado.
     */
    static async register(user: Omit<UserDTO, "password"> & { password: string }): Promise<UserDTO> {
      const response = await this.request<UserDTO>("/", "POST", user, false);
      return UserSchema.parse(response);
    }
    
    /**
     * Inicio de sesión.
     * 
     * @apicall POST - `http:localhost:8080/v1/users/login`
     * 
     * @param {string} email - Email / username.
     * @param {string} password - Contraseña asociada.
     * 
     * @returns {Promise<{UserDTO, string}>}>} Representación del terminado con éxito de una operación asíncrona, con resultado.
     */
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
  
    /**
     * Información de la cuenta activa.
     * 
     * @apicall GET - `http:localhost:8080/v1/users/me`
     * 
     * @returns {Promise<UserDTO>} Representación del terminado con éxito de una operación asíncrona, con resultado.
     */
    static async getCurrentUser(): Promise<UserDTO> {
      const response = await this.request<UserDTO>("/me", "GET");
      return UserSchema.parse(response);
    }
    
    /**
     * Actualización de la información de la cuenta activa.
     * 
     * @apicall PUT - `http:localhost:8080/v1/users/me`
     * 
     * @param {Partial<UserDTO>} - Información parcial (a cambiar) del usuario.
     * 
     * @returns {Promise<UserDTO>} Representación del terminado con éxito de una operación asíncrona, con resultado.
     */
    static async updateUser(userData: Partial<UserDTO>): Promise<UserDTO> {
      const response = await this.request<UserDTO>("/me", "PUT", userData);
      return UserSchema.parse(response);
    }
  
    /**
     * Cerrar sesión la cuenta activa.
     * 
     * @apicall POST - `http:localhost:8080/v1/users/logout`
     * 
     * @returns {Promise<void>} Representación del terminado con éxito de una operación asíncrona.
     */
    static async logout(): Promise<void> {
      await this.request<void>("/logout", "POST");
    }
    
    /**
     * Obtiene a todos los usuarios.
     * 
     * @apicall GET - `http:localhost:8080/v1/users`
     * 
     * @returns {Promise<UserDTO[]>} Representación del terminado con éxito de una operación asíncrona, con resultado.
     */
    static async getAllUsers(): Promise<UserDTO[]> {
      const response = await this.request<UserDTO[]>("/", "GET");
      return z.array(UserSchema).parse(response);
    }
  }
