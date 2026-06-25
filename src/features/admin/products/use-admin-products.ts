import { useCallback, useEffect, useState } from "react";
import { type Product, type Category } from "./types";
import { getAdminCategories, getAdminProducts } from "./api";

export function useAdminProducts() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Load categories from the server
  const loadCategories = useCallback(async () => {
    const data = await getAdminCategories();
    setCategories(data ?? []);
  }, []);

  // Load products based on the current search term
  const loadProducts = useCallback(async (searchValue: string) => {
    setLoading(true);

    try {
      const data = await getAdminProducts(searchValue);
      setProducts(data ?? []);
    } catch {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  function openCreateDialog() {
    setEditingProduct(null);
    setProductDialogOpen(true);
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product);
    setProductDialogOpen(true);
  }

  function closeProductDialog() {
    setProductDialogOpen(false);
    setEditingProduct(null);
  }

  const refreshAll = useCallback(async () => {
    await Promise.all([loadProducts(search), loadCategories()]);
  }, [loadProducts, loadCategories, search]);

  //   useEffect(() => {
  //     const loadCat = async () => {
  //       const data = await getAdminCategories();
  //       setCategories(data ?? []);
  //     };
  //     loadCat();
  //   }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProducts(search);
    }, 250); // debounce by 250ms
    return () => clearTimeout(timer);
  }, [search, loadProducts]);

  return {
    search,
    setSearch,
    products,
    categories,
    loading,
    refreshAll,
    categoryDialogOpen,
    setCategoryDialogOpen,
    productDialogOpen,
    setProductDialogOpen,
    editingProduct,
    setEditingProduct,
    openCreateDialog,
    closeProductDialog,
    openEditDialog,
  };
}
