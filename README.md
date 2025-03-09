# frontendcouncil-frontend
frontend del consejo del backend usando React con TypeScript

# Requisitos para instalacion

se nesesita lo siguiente:

- Node.js
- Npm (se puede usar yarn)

la instalacion de Node se puede encontrar en su [sitio oficial](https://nodejs.org/es)

## Instalacion

### para `Arch Linux` (de basados en el):
- Actualizamos paquetes:
  ```
  sudo pacman -Syu 
  ```

- Instalacion de Node.js y Npm:
  ```
  sudo pacman -S nodejs npm
  ```
- Instalacion de TypeScript:
  ```
  npm install -g typescript
  ```
### para `ubuntu` (y basados en debian)
  - Actualizar paquetes:
  ```
  sudo apt update
  ```
  - Instalacion de Node.js y Npm:
  ```
    sudo apt install nodejs npm -y
  ```
  - Verificamos la instalacion:
  ```
  node -v
  npm -v
  ```
  - Instalacion de TypeScript:
  ```
  npm install -g typescript
  ```
### para `fedora`:
- Instalacion de Node.js (ya incluye npm)
  ```
  sudo dnf install nodejs -y
  ```
- Instalacion de TypeScript
  ```
  npm install -g typescript
  ```
  
(opcional) ejecuta este comando para verificar la correcta instalacion de TypeScript
  ```
  tsc --version
  ```
# Ejecucion

lo primero es clonar el repositorio y colocarnos en la carpeta recien creada:
```
git clone https://github.com/ingenieria-software-7009-2025-2/frontendcouncil-frontend.git
cd frontendcouncil-frontend
```
ya en la carpeta `frontendcouncil-frontend`, ejecutamos los siguientes comandos:

```
npm install
```
```
npm run dev
```
si todo salio bien, el proyecto estara en ejecucion y se podra visualizar en un navegador web en localhost 

