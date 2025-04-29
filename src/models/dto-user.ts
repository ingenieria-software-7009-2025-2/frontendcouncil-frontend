 import { IncidentDTO } from "./dto-incident";

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