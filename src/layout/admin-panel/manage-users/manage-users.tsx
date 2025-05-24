import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Search } from "lucide-react";
import './manage-users.css';

/**
 * @global
 * Interfaz que maneja los datos de los usuarios.
 * 
 * @param {number} clienteid - ID del cliente
 * @param {string} userName - Nombre de usuario/cliente
 * @param {string} nombre - Nombre
 * @param {string} apPaterno - Apellido Paterno
 * @param {string} apMaterno - Apellido Materno
 * @param {string} correo - Correo electrónico
 * @param {string} rolid - ID del rol que tiene el usuario
 * 
 * @interface
 */
interface User {
  clienteid: number;
  userName: string;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  correo: string;
  rolid: string;
}

/**
 * @global
 * Lay-out y manejador de usuarios.
 * 
 * @apicall GET - `http://localhost:8080/v1/users/toolkit`
 * @apicall PUT - `http://localhost:8080/v1/users/toolkit`
 * 
 * @returns {JSX.Element} Elemento correspondiente
 */
const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'ascending' | 'descending' } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState<number | null>(null);

  // Simulación de datos temporales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulando retraso de red
        //await new Promise(resolve => setTimeout(resolve, 500));

        const fetchedUsers = await fetchUsersFromBackend();
        setUsers(fetchedUsers);
        // Datos temporales que hay que quitar

        setLoading(false);
      } catch (err) {
        setError('Error de conexión con la BD');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Obtiene una lista de todos los usuarios.
   * 
   * @apicall GET - `http://localhost:8080/v1/users/toolkit`
   * 
   * @returns {Promise<User[]>} Representación del terminado de una operación asíncrona junto con su resultado. 
  */
  const fetchUsersFromBackend = async (): Promise<User[]> => {
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://localhost:8080/v1/users/toolkit", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }

    const users: User[] = await response.json();
    return users;

    // return [];
  };

  /**
   * Modifica el rol de un usuario.
   * 
   * @apicall PUT - `http://localhost:8080/v1/users/toolkit`
   * 
   * @param {string} username - Nombre de usuario
   * @param {string} newRole - ID del rol nuevo
   * @param {number} oldRole - ID del rol viejo
   * @param {string} role - ID del rol viejo en cadena.
   * 
   * @returns {Promise<boolean>} Representación del terminado de una operación asíncrona junto con su resultado.
  */
const updateUserRole = async (username: string, newRole: string, oldRole : number, role : string): Promise<boolean> => {
    // Implementación chafa, xd
    // TODO: Update verif. de rol
    if (oldRole !== 2 || role !== '4'){
      return true
    }
    try {
      const token = sessionStorage.getItem("token");
      const peticion = {
        username: username,
        rolid: newRole
      }

      const response = await fetch("http://localhost:8080/v1/users/toolkit", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(peticion)
      });
      if (!response.ok) {
        throw new Error("no se pudo cambiar");
      }
    } catch (error) {
      console.log("fallo")
    }

    console.log(`Actualizando rol del usuario ${username} a ${newRole}`);
    window.location.reload();
    return true;
  };

  /**
   * Eliminado de usuario.
   * 
   * @param {number} userId - ID del usuario a eliminar.
   * 
   * @returns {Promise<boolean>} Representación del terminado de una operación asíncrona junto con su resultado.
   */
  const deleteUser = async (userId: number): Promise<boolean> => {
    // Implementación pendiente
    console.log(`Eliminando usuario ${userId}`);
    return true;
  };

  /**
   * Filtrado y ordenado de Usuarios.
   * 
   * @returns {User[]} - Lista de usuarios filtrada y ordenada.
   */
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.clienteid.toString().includes(searchLower) ||
      user.userName.toLowerCase().includes(searchLower) ||
      user.nombre.toLowerCase().includes(searchLower) ||
      user.apPaterno.toLowerCase().includes(searchLower) ||
      user.apMaterno.toLowerCase().includes(searchLower) ||
      user.correo.toLowerCase().includes(searchLower) ||
      user.rolid.toLowerCase().includes(searchLower)
    );
  });

  /**
   * Ordenado de usuarios.
   * 
   * @returns {Incidents[]} - Lista de usuarios ordenada.
   */
  const sortedUsers = React.useMemo(() => {
    if (!sortConfig) return filteredUsers;
    
    return [...filteredUsers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  /**
   * Solicitar ordenado.
   * 
   * @param key - Llave del usuario,
   */
  const requestSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  /**
   * Númerado de páginas. Evita recálculos innecesarios.
   * 
   * @param {number} totalPages - Número total de página.
   * @param {number} paginatedIncidents - Incidentes páginados.
   * 
   * @returns {{total, paginated}}
   */
  const { totalPages, paginatedUsers } = React.useMemo(() => {
    const total = Math.ceil(sortedUsers.length / itemsPerPage);
    const paginated = sortedUsers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    return { totalPages: total, paginatedUsers: paginated };
  }, [sortedUsers, currentPage, itemsPerPage]);

  /**
   * Manejador de items por cambio de página.
   * 
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Evento de cambio.
   * 
   * @eventProperty
   */
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    setItemsPerPage(newValue);
    // Resetear a la primera página cuando cambia el número de items por 1
    setCurrentPage(1);
  };

  /**
   * Ir a `n` página.
   * 
   * @param {number} page - Número de página.
   */
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  /**
   * Manejo de dropdowns.
   * 
   * @param {number} incidentId - ID del incidente.
   */
  const toggleDropdown = (userId: number) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
    setMoreDropdownOpen(null);
  };

  /**
   * Manejo de dropdowns.
   * 
   * @param {number} incidentId - ID del incidente.
   */
  const toggleMoreDropdown = (userId: number) => {
    setMoreDropdownOpen(moreDropdownOpen === userId ? null : userId);
    setDropdownOpen(null);
  };

  /**
   * Cerrar dropdowns.
   */
  const closeDropdowns = () => {
    setDropdownOpen(null);
    setMoreDropdownOpen(null);
  };

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => closeDropdowns();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="manage-users-container items-center">
        <h2 className="manage-users-title">Administración de Usuarios</h2>
        {users.length === 0 ? 
        (<div className="no-users">No hay usuarios registrados</div>
        ) : (
            <>
                <div className="users-search-bar">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar en la tabla..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-users-search-bar outline-none bg-transparent"
                    />
                </div>
                <div className="users-table-container">
                    <table className="users-table">
                    <thead>
                        <tr>
                        <th onClick={() => requestSort('clienteid')}>
                            ID {sortConfig?.key === 'clienteid' && (
                            sortConfig.direction === 'ascending' ? '↑' : '↓'
                            )}
                        </th>
                        <th onClick={() => requestSort('userName')}>
                            Username {sortConfig?.key === 'userName' && (
                            sortConfig.direction === 'ascending' ? '↑' : '↓'
                            )}
                        </th>
                        <th onClick={() => requestSort('nombre')}>
                            Nombre {sortConfig?.key === 'nombre' && (
                            sortConfig.direction === 'ascending' ? '↑' : '↓'
                            )}
                        </th>
                        <th onClick={() => requestSort('apPaterno')}>
                            Apellido Paterno {sortConfig?.key === 'apPaterno' && (
                            sortConfig.direction === 'ascending' ? '↑' : '↓'
                            )}
                        </th>
                        <th onClick={() => requestSort('apMaterno')}>
                            Apellido Materno {sortConfig?.key === 'apMaterno' && (
                            sortConfig.direction === 'ascending' ? '↑' : '↓'
                            )}
                        </th>
                        <th onClick={() => requestSort('correo')}>
                            Correo {sortConfig?.key === 'correo' && (
                            sortConfig.direction === 'ascending' ? '↑' : '↓'
                            )}
                        </th>
                        <th onClick={() => requestSort('rolid')}>
                            Rol {sortConfig?.key === 'rolid' && (
                            sortConfig.direction === 'ascending' ? '↑' : '↓'
                            )}
                        </th>
                        <th>Más</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.length > 0 ? (
                        paginatedUsers.map(user => (
                            <tr key={user.clienteid}>
                            <td>{user.clienteid}</td>
                            <td>{user.userName}</td>
                            <td>{user.nombre}</td>
                            <td>{user.apPaterno}</td>
                            <td>{user.apMaterno}</td>
                            <td>{user.correo}</td>
                            <td>
                                <div className="role-cell">
                                    <Dropdown show={dropdownOpen === user.clienteid} onToggle={() => toggleDropdown(user.clienteid)}>
                                        <Dropdown.Toggle 
                                            className="dropdown-toggle" 
                                            as="button" 
                                            onClick={(e: any) => {
                                            e.stopPropagation();
                                            toggleDropdown(user.clienteid);
                                            }}>
                                            {getRolNombre(user.rolid)} ⋮
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu">
                                            <Dropdown.Item onClick={(e) => {
                                            e.stopPropagation();
                                            const rol = sessionStorage.getItem("rol");
                                            updateUserRole(user.userName, '3',user.rolid ,rol);
                                            console.log(user.rolid);
                                            console.log(rol)
                                            closeDropdowns();
                                            }}>
                                            Subir a administrador
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => {
                                            e.stopPropagation();
                                            const rol = sessionStorage.getItem("rol");
                                            updateUserRole(user.userName, '1',user.rolid,rol);
                                              console.log(rol)
                                            console.log(user.rolid)
                                              console.log("1")
                                            closeDropdowns();
                                            }}>
                                            Bajar a Usuario
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                            <Dropdown show={moreDropdownOpen === user.clienteid} onToggle={() => toggleMoreDropdown(user.clienteid)}>
                                    <Dropdown.Toggle 
                                    className="more-toggle" 
                                    as="button" 
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                        toggleMoreDropdown(user.clienteid);
                                    }}>
                                    ⋮
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="more-dropdown">
                                    <Dropdown.Item onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Editar', user.clienteid);
                                    closeDropdowns();
                                    }}>
                                        Editar
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => {
                                    e.stopPropagation();
                                    deleteUser(user.clienteid);
                                    closeDropdowns();
                                    }}>
                                        Eliminar
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Ver detalles', user.clienteid);
                                    closeDropdowns();
                                    }}>
                                        Ver detalles
                                    </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>

                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan={9} className="no-results">
                            No se encontraron resultados
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                </div>
                
                <div className="pagination-controls">
                    <div className="items-per-page">
                    <span>Mostrar:</span>
                    <select 
                        value={itemsPerPage} 
                        onChange={handleItemsPerPageChange}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                    <span>registros</span>
                    </div>
                    
                    <div className="page-navigation">
                    <button 
                        onClick={() => goToPage(1)} 
                        disabled={currentPage === 1}
                    >
                        «
                    </button>
                    <button 
                        onClick={() => goToPage(currentPage - 1)} 
                        disabled={currentPage === 1}
                    >
                        ‹
                    </button>
                    
                    <span>
                        Página {currentPage} de {totalPages}
                    </span>
                    
                    <button 
                        onClick={() => goToPage(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                    >
                        ›
                    </button>
                    <button 
                        onClick={() => goToPage(totalPages)} 
                        disabled={currentPage === totalPages}
                    >
                        »
                    </button>
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

/**
 * @global
 * Obtiene el nombre del rol dado su identificador.
 * 
 * @param {number | string} rolid - ID del rol
 *  
 * @returns {string} - Nombre del rol.
 * 
 * @alpha
 */
function getRolNombre(rolid: number | string): string {
  switch (rolid) {
    case 1:
      return 'usuario';
    case 2:
      return 'Candidato';
    case 3:
      return 'administrador';
    case 4:
      return 'sudo';
    default:
      return 'Rol desconocido';
  }
}

/**
 * @module manage-users
 * 
 * Lay-out para el manejo de usuarios.
 * 
 * @remarks Lay-out especializado en el manejo de usuarios, con operaciones extra.
 */
export default ManageUsers;