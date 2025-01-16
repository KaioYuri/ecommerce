'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Category, Product } from '../../../../utils/types/types';
import { API_BASE_URL } from '@/app/apiConfig';

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    sku: '',
    quantity: 0,
    category: undefined,
  });
  const [open, setOpen] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const GetCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Falha ao buscar categorias');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleOpen = async () => {
    setOpen(true);
    await GetCategories(); // Carrega categorias apenas ao abrir o formulário
  };

  const handleClose = () => {
    setOpen(false);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      sku: '',
      quantity: 0,
      category: undefined,
    });
    setCategories([]); // Limpa as categorias para evitar dados obsoletos
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error('Failed to add product');
      const addedProduct = await response.json();
      setProducts([...products, addedProduct]);
      handleClose();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <PageContainer title="Produtos" description="Tabela de produtos disponíveis">
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{ float: 'right', marginBottom: '10px' }}
      >
        Adicionar Produto
      </Button>

      {loadingProducts ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Categoria</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>R$ {product.price}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.category?.name || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Adicionar Novo Produto</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descrição"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Preço"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="SKU"
            value={newProduct.sku}
            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Quantidade"
            type="number"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Categoria"
            value={newProduct.category?.id || ''}
            onChange={(e) => {
              const selectedCategory = categories.find(
                (category) => category.id === parseInt(e.target.value)
              );
              setNewProduct({ ...newProduct, category: selectedCategory });
            }}
            margin="normal"
            disabled={loadingCategories}
          >
            {loadingCategories ? (
              <MenuItem disabled>Carregando categorias...</MenuItem>
            ) : (
              categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))
            )}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddProduct} color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ProductTable;
