export interface PhotoDTO {
  fotoid: Uint8Array; // Representación TypeScript del ByteArray de Kotlin
  incidenteid: string;
}

export interface PhotoBody {
  fotoid: Uint8Array | ArrayBuffer; // Para enviar al backend
  incidenteid: string;
}