import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ProductCatalog from '../react-island/ProductCatalog';

const mockProducts = [
  {
    id: 1,
    name: 'Casco Forestal',
    model: 'F1-Pro',
    brand: 'ProtonFire',
    category: 'Forestal',
    categories: ['Forestal', 'Rescate'],
    image: '/images/casco1.jpg',
    type: 'Protección',
  },
  {
    id: 2,
    name: 'Guantes Rescate',
    model: 'G2-Max',
    brand: 'SafetyPro',
    category: 'Rescate',
    categories: ['Rescate'],
    image: '/images/guantes1.jpg',
    type: 'Protección',
  },
  {
    id: 3,
    name: 'Botas Forestales',
    model: 'B3-Ultra',
    brand: 'ProtonFire',
    category: 'Forestal',
    categories: ['Forestal'],
    image: '/images/botas1.jpg',
    type: 'Calzado',
  },
];

const mockCategories = ['Forestal', 'Rescate'];
const mockBrands = ['ProtonFire', 'SafetyPro'];
const mockTypes = ['Protección', 'Calzado'];

describe('ProductCatalog', () => {
  beforeEach(() => {
    render(
      <ProductCatalog
        initialProducts={mockProducts}
        categories={mockCategories}
        brands={mockBrands}
        types={mockTypes}
      />
    );
  });

  describe('Renderizado inicial', () => {
    it('debe renderizar todos los productos inicialmente', () => {
      expect(screen.getByText('Casco Forestal')).toBeInTheDocument();
      expect(screen.getByText('Guantes Rescate')).toBeInTheDocument();
      expect(screen.getByText('Botas Forestales')).toBeInTheDocument();
    });

    it('debe mostrar el contador de productos correctamente', () => {
      expect(screen.getByText('3 productos encontrados')).toBeInTheDocument();
    });

    it('debe renderizar todos los filtros de categoría', () => {
      expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Forestal' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Rescate' })).toBeInTheDocument();
    });
  });

  describe('Búsqueda de productos', () => {
    it('debe filtrar productos por nombre', () => {
      const searchInput = screen.getByPlaceholderText(/buscar producto/i);
      fireEvent.change(searchInput, { target: { value: 'Casco' } });

      expect(screen.getByText('Casco Forestal')).toBeInTheDocument();
      expect(screen.queryByText('Guantes Rescate')).not.toBeInTheDocument();
      expect(screen.queryByText('Botas Forestales')).not.toBeInTheDocument();
      expect(screen.getByText('1 producto encontrado')).toBeInTheDocument();
    });

    it('debe filtrar productos por marca', () => {
      const searchInput = screen.getByPlaceholderText(/buscar producto/i);
      fireEvent.change(searchInput, { target: { value: 'SafetyPro' } });

      expect(screen.getByText('Guantes Rescate')).toBeInTheDocument();
      expect(screen.queryByText('Casco Forestal')).not.toBeInTheDocument();
    });

    it('debe mostrar mensaje cuando no hay resultados', () => {
      const searchInput = screen.getByPlaceholderText(/buscar producto/i);
      fireEvent.change(searchInput, { target: { value: 'ProductoInexistente' } });

      expect(screen.getByText(/no se encontraron productos/i)).toBeInTheDocument();
      expect(screen.getByText('0 productos encontrados')).toBeInTheDocument();
    });
  });

  describe('Filtros de categoría', () => {
    it('debe filtrar productos por categoría Forestal', () => {
      const forestalButton = screen.getByRole('button', { name: 'Forestal' });
      fireEvent.click(forestalButton);

      expect(screen.getByText('Casco Forestal')).toBeInTheDocument();
      expect(screen.getByText('Botas Forestales')).toBeInTheDocument();
      expect(screen.queryByText('Guantes Rescate')).not.toBeInTheDocument();
      expect(screen.getByText('2 productos encontrados')).toBeInTheDocument();
    });

    it('debe filtrar productos por categoría Rescate', () => {
      const rescateButton = screen.getByRole('button', { name: 'Rescate' });
      fireEvent.click(rescateButton);

      expect(screen.getByText('Casco Forestal')).toBeInTheDocument();
      expect(screen.getByText('Guantes Rescate')).toBeInTheDocument();
      expect(screen.queryByText('Botas Forestales')).not.toBeInTheDocument();
    });

    it('debe mostrar todos los productos al seleccionar "Todos"', () => {
      const forestalButton = screen.getByRole('button', { name: 'Forestal' });
      fireEvent.click(forestalButton);

      const todosButton = screen.getByRole('button', { name: 'Todos' });
      fireEvent.click(todosButton);

      expect(screen.getByText('Casco Forestal')).toBeInTheDocument();
      expect(screen.getByText('Guantes Rescate')).toBeInTheDocument();
      expect(screen.getByText('Botas Forestales')).toBeInTheDocument();
    });
  });

  describe('Filtros de marca', () => {
    it('debe filtrar productos por marca ProtonFire', () => {
      const brandButtons = screen.getAllByRole('button', { name: 'ProtonFire' });
      fireEvent.click(brandButtons[0]);

      expect(screen.getByText('Casco Forestal')).toBeInTheDocument();
      expect(screen.getByText('Botas Forestales')).toBeInTheDocument();
      expect(screen.queryByText('Guantes Rescate')).not.toBeInTheDocument();
    });
  });

  describe('Filtros de tipo', () => {
    it('debe filtrar productos por tipo Calzado', () => {
      const calzadoButton = screen.getByRole('button', { name: 'Calzado' });
      fireEvent.click(calzadoButton);

      expect(screen.getByText('Botas Forestales')).toBeInTheDocument();
      expect(screen.queryByText('Casco Forestal')).not.toBeInTheDocument();
      expect(screen.queryByText('Guantes Rescate')).not.toBeInTheDocument();
    });
  });

  describe('Resetear filtros', () => {
    it('debe resetear todos los filtros al hacer click en "Restablecer"', () => {
      const searchInput = screen.getByPlaceholderText(/buscar producto/i);
      fireEvent.change(searchInput, { target: { value: 'Casco' } });

      const forestalButton = screen.getByRole('button', { name: 'Forestal' });
      fireEvent.click(forestalButton);

      const resetButton = screen.getByRole('button', { name: /restablecer/i });
      fireEvent.click(resetButton);

      expect(searchInput).toHaveValue('');
      expect(screen.getByText('3 productos encontrados')).toBeInTheDocument();
    });
  });

  describe('Productos con múltiples categorías', () => {
    it('debe mostrar producto en múltiples categorías', () => {
      const rescateButton = screen.getByRole('button', { name: 'Rescate' });
      fireEvent.click(rescateButton);

      expect(screen.getByText('Casco Forestal')).toBeInTheDocument();

      const forestalButton = screen.getByRole('button', { name: 'Forestal' });
      fireEvent.click(forestalButton);

      expect(screen.getByText('Casco Forestal')).toBeInTheDocument();
    });
  });
});
