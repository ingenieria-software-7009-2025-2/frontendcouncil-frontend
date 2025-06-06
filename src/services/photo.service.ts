import { PhotoDTO, PhotoBody } from '../models/dto-photo';

export class PhotoService {
  private baseUrl: string = 'http://tu-backend.com/api/v1/photos'; // Ajusta esta URL

  async getPhotosByIncident(incidentId: string): Promise<PhotoDTO[]> {
    const requestBody = {
      fotoid: new Uint8Array(), // ByteArray vacío
      incidenteid: incidentId
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...requestBody,
        fotoid: Array.from(requestBody.fotoid) // Convertir Uint8Array a array normal para JSON
      })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.map((photo: any) => ({
      ...photo,
      fotoid: new Uint8Array(photo.fotoid) // Convertir array a Uint8Array
    }));
  }

  async uploadPhoto(incidentId: string, file: File): Promise<PhotoDTO> {
    const arrayBuffer = await file.arrayBuffer();
    const requestBody = {
      fotoid: new Uint8Array(arrayBuffer),
      incidenteid: incidentId
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...requestBody,
        fotoid: Array.from(requestBody.fotoid) // Convertir para JSON
      })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      ...data,
      fotoid: new Uint8Array(data.fotoid)
    };
  }

  // Método para mostrar fotos como URL (crea URL temporal)
  createPhotoUrl(photo: PhotoDTO): string {
    const blob = new Blob([photo.fotoid], { type: 'image/jpeg' }); // Ajusta el tipo MIME
    return URL.createObjectURL(blob);
  }

  async uploadPhotos(incidentId: string, files: File[]): Promise<void> {
    const token = sessionStorage.getItem("token");
    
    // Subir cada foto individualmente
    await Promise.all(files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const photoBody = {
        fotoid: Array.from(new Uint8Array(arrayBuffer)), // Convertir a array para JSON
        incidenteid: incidentId
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(photoBody)
      });

      if (!response.ok) {
        throw new Error(`Error al subir foto: ${response.status}`);
      }
    }));
  }

}