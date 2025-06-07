import { PhotoDTO } from '../models/dto-photo';

export class PhotoService {
  private apiUrl = 'http://localhost:8080/v1/photos';

  async uploadPhoto(incidenteid: string, photoFile: File): Promise<PhotoDTO> {
    try {
      const byteArray = await this.fileToByteArray(photoFile);

      // Estructura que coincide exactamente con PhotoBody del backend
      const photoData = {
        fotoid: Array.from(byteArray), // Convertir Uint8Array a array normal
        incidenteid: incidenteid
      };

      const token = sessionStorage.getItem("token");
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(photoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir la foto');
      }

      const responseData = await response.json();
      
      // Convertir el array de bytes de vuelta a Uint8Array
      return {
        fotoid: new Uint8Array(responseData.fotoid),
        incidenteid: responseData.incidenteid
      };
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }

  private fileToByteArray(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        if (reader.result) {
          resolve(new Uint8Array(reader.result as ArrayBuffer));
        } else {
          reject(new Error('No se pudo leer el archivo'));
        }
      };
      reader.onerror = error => reject(error);
    });
  }

  async getPhotosByIncident(incidentId: string): Promise<PhotoDTO[]> {
    const response = await fetch(`${this.apiUrl}?incidenteid=${incidentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.map((photo: any) => ({
      fotoid: new Uint8Array(photo.fotoid),
      incidenteid: photo.incidenteid
    }));
  }
}