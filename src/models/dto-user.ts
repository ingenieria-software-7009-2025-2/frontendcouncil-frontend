export type UserRole = '1' | '2' | '3';

export interface UserDTO {
  clienteid: number;
  userName: string;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  correo: string;
  rolid: string;
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
    }
   */