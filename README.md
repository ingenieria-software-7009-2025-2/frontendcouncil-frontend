# frontendcouncil-frontend
Frontend del Consejo del Backend usando React con TypeScript.

### Requisitos para instalación

- Node.js
- Npm (se puede usar yarn)

La instalacion de Node se puede encontrar en su [sitio oficial](https://nodejs.org/es).

## Instalación

### Para `Arch Linux` (y basados en él):

- Actualizamos paquetes:

  ```bash
  sudo pacman -Syu 
  ```

- Instalación de Node.js y Npm:

  ```bash
  sudo pacman -S nodejs npm
  ```
  
- Instalación de TypeScript:

  ```
  npm install -g typescript
  ```
  
### Para `Ubuntu` (y basados en `Debian`)

  - Actualizar paquetes:

  ```bash
  sudo apt update
  ```
  
  - Instalación de Node.js y Npm:
  
  ```bash
    sudo apt install nodejs npm -y
  ```
  
  - Verificamos la instalación:
  
  ```bash
  node -v
  npm -v
  ```

  - Instalación de TypeScript:
  
  ```bash
  npm install -g typescript
  ```

### Para `Fedora`:

- Instalación de Node.js (ya incluye npm)

  ```bash
  sudo dnf install nodejs -y
  ```
  
- Instalación de TypeScript

  ```bash
  npm install -g typescript
  ```
  
- (Opcional) Ejecute este comando para verificar la correcta instalación de TypeScript

  ```bash
  tsc --version
  ```
  
## Ejecución

Primero, se requiere clonar el repositorio y colocarnos en la carpeta recien creada:

```bash
git clone https://github.com/ingenieria-software-7009-2025-2/frontendcouncil-frontend.git
cd frontendcouncil-frontend
```

Despúes, ya en la carpeta `frontendcouncil-frontend/`, ejecutamos los siguientes comandos:

```bash
npm install
```

```bash
npm run dev
```

Si todo ha salido de manera correcta, el proyecto estará en ejecución y se podrá visualizar en un **navegador web en localhost**. 

## Documentación

Se hizo documentación TSDoc style TSDoc para generar la documentación del proyecto.

Se tienen los tags personalizados `@apicall (Método HTTP | _) - URL` para denotar llamadas a la API y el tag  `@interface` para denotar interfaces como Modifier tag.
También se tiene la notación `{fuction}` para denotar funciones que no son callbacks explicitamente.
