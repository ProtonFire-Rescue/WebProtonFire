export const getProducts = async () => {
    const response = await fetch('http://localhost:1337/api/productos?populate=*');
    const data = await response.json();
    return data;
};

export const getCategories = async () => {
    const response = await fetch('http://localhost:1337/api/categories');
    const data = await response.json();
    return data;
};

export const getBrands = async () => {
    const response = await fetch('http://localhost:1337/api/brands');
    const data = await response.json();
    return data;
};

export const getProductById = async (id: string | undefined) => {
    const response = await fetch(`http://localhost:1337/api/productos?id=${id}&populate=*`);
    const data = await response.json();
    return data;
};

export const getRelatedProducts = async (categoryName: string) => {
    const response = await fetch(`http://localhost:1337/api/productos?filters[category][categoryName][$eq]=${categoryName}&populate=*`);
    const data = await JSON.parse(await response.text());
    return data;
};