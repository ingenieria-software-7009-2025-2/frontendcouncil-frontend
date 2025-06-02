import { CategoryDTO } from '../models/dto-category';

// Simulación de categorías desde el "backend"
const mockCategories: CategoryDTO[] = [
  { id: '1', name: 'Bache en la vía', icon: '🕳️' },
  { id: '2', name: 'Alumbrado público', icon: '💡' },
  { id: '3', name: 'Basura acumulada', icon: '🗑️' },
  { id: '4', name: 'Fuga de agua', icon: '💧' },
  { id: '5', name: 'Vandalismo', icon: '🏴‍☠️' },
  { id: '6', name: 'Otro', icon: '❓' },
];

export const getCategories = async (): Promise<CategoryDTO[]> => {
  // Simula un pequeño delay para parecer una llamada real
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCategories), 50);
  });
};
