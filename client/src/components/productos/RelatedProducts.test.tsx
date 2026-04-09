import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import RelatedProducts from '../react-island/RelatedProducts';

const mockRelatedProducts = [
  {
    id: 2,
    name: 'Casco Forestal Pro',
    slug: 'casco-forestal-pro',
    images: [{ id: 1, url: 'http://localhost:1337/images/casco2.jpg', alt: 'Casco' }],
    category: 'Forestal',
    categories: ['Forestal'],
    brand: 'ProtonFire',
    model: 'F2-Pro',
    description: 'Casco profesional',
  },
  {
    id: 3,
    name: 'Casco Rescate Max',
    slug: 'casco-rescate-max',
    images: [{ id: 2, url: 'http://localhost:1337/images/casco3.jpg', alt: 'Casco' }],
    category: 'Rescate',
    categories: ['Rescate'],
    brand: 'SafetyPro',
    model: 'R1-Max',
    description: 'Casco de rescate',
  },
];

const mockApiResponse = {
  data: [
    {
      id: 2,
      name: 'Casco Forestal Pro',
      slug: 'casco-forestal-pro',
      images: [{ id: 1, url: '/images/casco2.jpg', alternativeText: 'Casco' }],
      categories: [{ name: 'Forestal' }],
      brand: { name: 'ProtonFire' },
      model: { name: 'F2-Pro' },
      description: 'Casco profesional',
    },
    {
      id: 3,
      name: 'Casco Rescate Max',
      slug: 'casco-rescate-max',
      images: [{ id: 2, url: '/images/casco3.jpg', alternativeText: 'Casco' }],
      categories: [{ name: 'Rescate' }],
      brand: { name: 'SafetyPro' },
      model: { name: 'R1-Max' },
      description: 'Casco de rescate',
    },
  ],
};

describe('RelatedProducts', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Estado de carga', () => {
    it('debe mostrar skeleton mientras carga', () => {
      (global.fetch as any).mockImplementation(() => new Promise(() => {}));

      render(
        <RelatedProducts
          categoryName="Forestal"
          excludeId={1}
          backendUrl="http://localhost:1337"
        />
      );

      const skeletons = screen.getAllByRole('generic').filter(el => 
        el.className.includes('animate-pulse')
      );
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('debe mostrar el título de productos relacionados', () => {
      (global.fetch as any).mockImplementation(() => new Promise(() => {}));

      render(
        <RelatedProducts
          categoryName="Forestal"
          excludeId={1}
          backendUrl="http://localhost:1337"
        />
      );

      expect(screen.getByText('Productos relacionados')).toBeInTheDocument();
    });
  });

  describe('Carga exitosa de productos', () => {
    it('debe cargar y mostrar productos relacionados', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(
        <RelatedProducts
          categoryName="Forestal"
          excludeId={1}
          backendUrl="http://localhost:1337"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Casco Forestal Pro')).toBeInTheDocument();
      });

      expect(screen.getByText('Casco Rescate Max')).toBeInTheDocument();
      expect(screen.getByText('ProtonFire')).toBeInTheDocument();
      expect(screen.getByText('SafetyPro')).toBeInTheDocument();
    });

    it('debe excluir el producto actual de los resultados', async () => {
      const responseWithExcluded = {
        data: [
          {
            id: 1,
            name: 'Producto Actual',
            images: [{ id: 1, url: '/images/actual.jpg', alternativeText: 'Actual' }],
            categories: [{ name: 'Forestal' }],
            brand: { name: 'Brand' },
            model: { name: 'Model' },
            description: 'Descripción',
          },
          ...mockApiResponse.data,
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithExcluded,
      });

      render(
        <RelatedProducts
          categoryName="Forestal"
          excludeId={1}
          backendUrl="http://localhost:1337"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Casco Forestal Pro')).toBeInTheDocument();
      });

      expect(screen.queryByText('Producto Actual')).not.toBeInTheDocument();
    });

    it('debe hacer la llamada correcta a la API', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(
        <RelatedProducts
          categoryName="Forestal"
          excludeId={1}
          backendUrl="http://localhost:1337"
        />
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('http://localhost:1337/api/productos')
        );
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('filters[categories][name][$eq]=Forestal')
      );
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar errores de red correctamente', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      render(
        <RelatedProducts
          categoryName="Forestal"
          excludeId={1}
          backendUrl="http://localhost:1337"
        />
      );

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error loading related products:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it('debe mostrar mensaje cuando no hay productos relacionados', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      render(
        <RelatedProducts
          categoryName="Forestal"
          excludeId={1}
          backendUrl="http://localhost:1337"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('No hay productos relacionados disponibles')).toBeInTheDocument();
      });
    });

    it('no debe hacer llamada si no hay categoryName', async () => {
      render(
        <RelatedProducts
          categoryName=""
          excludeId={1}
          backendUrl="http://localhost:1337"
        />
      );

      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled();
      });

      expect(screen.getByText('No hay productos relacionados disponibles')).toBeInTheDocument();
    });
  });

  describe('Renderizado de productos', () => {
    it('debe renderizar enlaces correctos a productos', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(
        <RelatedProducts
          categoryName="Forestal"
          excludeId={1}
          backendUrl="http://localhost:1337"
        />
      );

      await waitFor(() => {
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveAttribute('href', '/producto/forestal/casco-forestal-pro');
        expect(links[1]).toHaveAttribute('href', '/producto/rescate/casco-rescate-max');
      });
    });

    it('debe renderizar imágenes de productos correctamente', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(
        <RelatedProducts
          categoryName="Forestal"
          excludeId={1}
          backendUrl="http://localhost:1337"
        />
      );

      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images[0]).toHaveAttribute('src', 'http://localhost:1337/images/casco2.jpg');
        expect(images[0]).toHaveAttribute('alt', 'Casco Forestal Pro');
      });
    });
  });
});
