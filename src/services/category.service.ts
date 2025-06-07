import { CategoryDTO } from '../models/dto-category';

// Simulación de categorías desde el "backend"
const mockCategories: CategoryDTO[] = [
  { categoriaid: '1', name: 'Bache en la vía', icon: '🕳️' },
  { categoriaid: '2', name: 'Alumbrado público', icon: '💡' },
  { categoriaid: '3', name: 'Basura acumulada', icon: '🗑️' },
  { categoriaid: '4', name: 'Fuga de agua', icon: '💧' },
  { categoriaid: '5', name: 'Vandalismo', icon: '🏴‍☠️' },
  { categoriaid: '6', name: 'Otro', icon: '❓' },
];

export const getCategories = async (): Promise<CategoryDTO[]> => {
  // Simula un pequeño delay para parecer una llamada real
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCategories), 50);
  });
};
