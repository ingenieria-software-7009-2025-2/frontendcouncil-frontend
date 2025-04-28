import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Search } from "lucide-react";
import './manage-users.css';

interface User {
  id: number;
  username: string;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  correo: string;
  rol: string;
}

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
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Datos temporales que hay que quitar
        const tempUsers: User[] = [
          {
            id: 1,
            username: 'admin',
            nombre: 'Admin',
            apPaterno: 'Admin',
            apMaterno: 'Admin',
            correo: 'admin@admin.com',
            rol: 'Administrador'
          },
          {
            id: 2,
            username: 'user1',
            nombre: 'AUser',
            apPaterno: 'AUser',
            apMaterno: 'AUser',
            correo: 'user@example.com',
            rol: 'Usuario'
          },
          {
            id: 3,
            username: 'lrodriguez',
            nombre: 'BUser',
            apPaterno: 'BUser',
            apMaterno: 'BUser',
            correo: 'user@example.com',
            rol: 'Usuario'
          },
          {
            id: 4,
            username: 'cuser',
            nombre: 'CUser',
            apPaterno: 'CUser',
            apMaterno: 'CUser',
            correo: 'user@example.com',
            rol: 'Usuario'
          },
          {
            id: 5,
            username: 'duser',
            nombre: 'DUser',
            apPaterno: 'DUser',
            apMaterno: 'DUser',
            correo: 'user@example.com',
            rol: 'Usuario'
          },
          {
            id: 6,
            username: 'eUser',
            nombre: 'EUser',
            apPaterno: 'EUser',
            apMaterno: 'EUser',
            correo: 'user@example.com',
            rol: 'Usuario'
          },
          {
            id: 7,
            username: 'fuser',
            nombre: 'FUser',
            apPaterno: 'FUser',
            apMaterno: 'FUser',
            correo: 'user@example.com',
            rol: 'Usuario'
          },
          {
            id: 8,
            username: 'guser',
            nombre: 'GUser',
            apPaterno: 'GUser',
            apMaterno: 'GUser',
            correo: 'user@example.com',
            rol: 'Usuario'
          },
          {
            id: 9,
            username: 'huser',
            nombre: 'HUser',
            apPaterno: 'HUser',
            apMaterno: 'HUser',
            correo: 'user@example.com',
            rol: 'Usuario'
          },
          {
            id: 10,
            username: 'iuser',
            nombre: 'IUser',
            apPaterno: 'IUser',
            apMaterno: 'IUser',
            correo: 'user@example.com',
            rol: 'Usuario'
          },
        ];
        
        setUsers(tempUsers);
        setLoading(false);
      } catch (err) {
        setError('Error de conexión con la BD');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Métodos para el backend que van a (sin implementar)
  const fetchUsersFromBackend = async (): Promise<User[]> => {
    // Implementación pendiente
    return [];
  };

  const updateUserRole = async (userId: number, newRole: string): Promise<boolean> => {
    // Implementación pendiente
    console.log(`Actualizando rol del usuario ${userId} a ${newRole}`);
    return true;
  };

  const deleteUser = async (userId: number): Promise<boolean> => {
    // Implementación pendiente
    console.log(`Eliminando usuario ${userId}`);
    return true;
  };

  // Filtrado y ordenación
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.id.toString().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.nombre.toLowerCase().includes(searchLower) ||
      user.apPaterno.toLowerCase().includes(searchLower) ||
      user.apMaterno.toLowerCase().includes(searchLower) ||
      user.correo.toLowerCase().includes(searchLower) ||
      user.rol.toLowerCase().includes(searchLower)
    );
  });

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

  const requestSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Paginación con useMemo para evitar recálculos innecesarios
  const { totalPages, paginatedUsers } = React.useMemo(() => {
    const total = Math.ceil(sortedUsers.length / itemsPerPage);
    const paginated = sortedUsers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    return { totalPages: total, paginatedUsers: paginated };
  }, [sortedUsers, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    setItemsPerPage(newValue);
    // Resetear a la primera página cuando cambia el número de items por página
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Manejo de dropdowns
  const toggleDropdown = (userId: number) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
    setMoreDropdownOpen(null);
  };

  const toggleMoreDropdown = (userId: number) => {
    setMoreDropdownOpen(moreDropdownOpen === userId ? null : userId);
    setDropdownOpen(null);
  };

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
                        <th onClick={() => requestSort('id')}>
                            ID {sortConfig?.key === 'id' && (
                            sortConfig.direction === 'ascending' ? '↑' : '↓'
                            )}
                        </th>
                        <th onClick={() => requestSort('username')}>
                            Username {sortConfig?.key === 'username' && (
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
                        <th onClick={() => requestSort('rol')}>
                            Rol {sortConfig?.key === 'rol' && (
                            sortConfig.direction === 'ascending' ? '↑' : '↓'
                            )}
                        </th>
                        <th>Solicitud cambio de rol</th>
                        <th>Más</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.length > 0 ? (
                        paginatedUsers.map(user => (
                            <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.nombre}</td>
                            <td>{user.apPaterno}</td>
                            <td>{user.apMaterno}</td>
                            <td>{user.correo}</td>
                            <td>
                                <div className="role-cell">
                                    <Dropdown show={dropdownOpen === user.id} onToggle={() => toggleDropdown(user.id)}>
                                        <Dropdown.Toggle 
                                            className="dropdown-toggle" 
                                            as="button" 
                                            onClick={(e: any) => {
                                            e.stopPropagation();
                                            toggleDropdown(user.id);
                                            }}>
                                            {user.rol} ⋮
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu">
                                            <Dropdown.Item onClick={(e) => {
                                            e.stopPropagation();
                                            updateUserRole(user.id, 'Administrador');
                                            closeDropdowns();
                                            }}>
                                            Administrador
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => {
                                            e.stopPropagation();
                                            updateUserRole(user.id, 'Usuario');
                                            closeDropdowns();
                                            }}>
                                            Usuario
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>True / False </td>
                            <td>
                            <Dropdown show={moreDropdownOpen === user.id} onToggle={() => toggleMoreDropdown(user.id)}>
                                    <Dropdown.Toggle 
                                    className="more-toggle" 
                                    as="button" 
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                        toggleMoreDropdown(user.id);
                                    }}>
                                    ⋮
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="more-dropdown">
                                    <Dropdown.Item onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Editar', user.id);
                                    closeDropdowns();
                                    }}>
                                        Editar
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => {
                                    e.stopPropagation();
                                    deleteUser(user.id);
                                    closeDropdowns();
                                    }}>
                                        Eliminar
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Ver detalles', user.id);
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

export default ManageUsers;