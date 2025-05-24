import { IncidentDTO } from "./dto-incident";

/**
 * Modelo de Usuario.
 * 
 * @param {string} username
 * @param {string} nombre
 * @param {string} apPaterno
 * @param {string} apMaterno
 * @param {string} correo
 * @param {string} [password]
 * @param {string} [token]
 * 
 * @interface
 */
export interface UserDTO {
  username: string;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  correo: string;
  password?: string;
  token?: string;
}

  /**
   * NOTA: Tenemos que regresar al formato de usuario para aplicar el rol de cada uno
   * 
    export interface UserDTO {
        UserID: int;
        Username: string;
        RolID: int;
        email: string;
        Name: string;
        lastName: string;
        motherLastName: string;
        token?: string;
        incidents: IncidentDTO[];
    }
   */