import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CardContent,
  Typography,
  Grid,
  Tooltip,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  IconButton,
  Stack,
} from "@mui/material";
import { IconBasket, IconTrash } from "@tabler/icons-react";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";
import { Product, Sale } from "@/utils/types/types";
import { API_BASE_URL } from "@/app/apiConfig";

const Blog = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [newSaleForm, setNewSaleForm] = useState({
    customer: "",
    selectedProducts: [{ productId: 0, quantity: 0 }],
  });
  const [openSaleForm, setOpenSaleForm] = useState(false);

  // Função para carregar as vendas
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("http://localhost:3001/sales");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Sale[] = await response.json();
        setSales(data);
      } catch (err) {
        console.error("Error fetching sales:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  // Função para carregar os produtos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError((err as Error).message);
      }
    };

    fetchProducts();
  }, []);

  // Função para atualizar a quantidade de um produto
  const handleProductQuantityChange = (index: number, value: number) => {
    const updatedProducts = [...newSaleForm.selectedProducts];
    updatedProducts[index].quantity = value;
    setNewSaleForm({ ...newSaleForm, selectedProducts: updatedProducts });
  };

  // Função para selecionar um produto
  const handleProductSelect = (index: number, productId: number) => {
    const updatedProducts = [...newSaleForm.selectedProducts];
    updatedProducts[index].productId = productId;
    setNewSaleForm({ ...newSaleForm, selectedProducts: updatedProducts });
  };

  // Função para adicionar um produto
  const handleAddProduct = () => {
    setNewSaleForm((prevForm) => ({
      ...prevForm,
      selectedProducts: [...prevForm.selectedProducts, { productId: 0, quantity: 0 }],
    }));
  };

  // Função para remover um produto
  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...newSaleForm.selectedProducts];
    updatedProducts.splice(index, 1);
    setNewSaleForm({ ...newSaleForm, selectedProducts: updatedProducts });
  };


  // Função para calcular o total da venda
  const calculateTotalAmount = () => {
    let total = 0;

    newSaleForm.selectedProducts.forEach((product) => {
      const productDetails = products.find((prod) => prod.id === product.productId);
      if (productDetails) {
        const quantity = product.quantity || 0; // Garantir que a quantidade seja um número válido
        const price = productDetails.price || 0; // Garantir que o preço seja um número válido
        total += price * quantity;
      }
    });

    return total;
  };

  // Função para enviar o formulário de venda
  const handleCreateSale = async () => {
    const saleItems = newSaleForm.selectedProducts.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const totalAmount = calculateTotalAmount();

    const saleData = {
      customer: newSaleForm.customer,
      saleDate: new Date().toISOString(),
      products: saleItems,
      totalAmount: totalAmount,
    };

    try {
      // Cria a venda
      const response = await fetch("http://localhost:3001/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar venda");
      }

      const createdSale = await response.json();
      setSales((prevSales) => [...prevSales, createdSale]); // Atualiza a lista de vendas

      // Atualiza o estoque de cada produto da venda
      for (const item of saleItems) {
        const productResponse = await fetch(`http://localhost:3001/products/${item.productId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: item.quantity, // Subtrai a quantidade vendida
          }),
        });

        if (!productResponse.ok) {
          throw new Error(`Erro ao atualizar estoque do produto ${item.productId}`);
        }
      }

      setOpenSaleForm(false); // Fecha o formulário
      alert("Venda criada e estoque atualizado com sucesso!");
    } catch (error) {
      console.error("Erro criando a venda:", error);
      alert("Erro criando a venda");
    }
  };


  const handleCompletePurchase = async () => {
    if (selectedSaleId !== null) {
      const selectedSale = sales.find((sale) => sale.id === selectedSaleId); // Encontrando a venda selecionada
      if (selectedSale) {
        // Preparar os dados para o POST
        const productsData = selectedSale.products
          .map((saleProduct) => {
            const productId = saleProduct.product.id;
            const quantity = saleProduct.quantity;
  
            // Verificar se todos os produtos têm productId e quantity válidos
            if (!productId || !quantity || isNaN(Number(productId)) || isNaN(Number(quantity))) {
              alert("Todos os produtos precisam ter um ID e uma quantidade válidos.");
              return null;
            }
  
            return {
              productId: productId,    // Mantendo o ID do produto como número
              quantity: quantity,      // Mantendo a quantidade como número
            };
          })
          .filter((item) => item !== null) as { productId: number; quantity: number }[]; // Filtra null e faz o cast correto
  
        if (productsData.length === 0) {
          return; // Se não houver produtos válidos, não faz o POST
        }
  
        const purchaseData = {
          saleId: selectedSale.id, // ID da venda
          productId: productsData[0].productId, // Usando o primeiro produto, ou ajustando conforme necessário
          price: selectedSale.products.reduce(
            (total, saleProduct) =>
              total + (saleProduct.product.price * saleProduct.quantity),
            0
          ), // Preço total
          quantity: selectedSale.products.reduce(
            (total, saleProduct) => total + saleProduct.quantity,
            0
          ), // Quantidade total
          purchaseDate: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
          status: "Pendente", // Status inicial
          paymentDate: null,  // Será null por padrão
          installments: 1,    // Parcela única, ou altere conforme necessidade
        };
  
        try {
          const response = await fetch(`${API_BASE_URL}/purchases`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(purchaseData),
          });
  
          if (!response.ok) {
            throw new Error("Erro ao realizar a compra");
          }
  
          alert("Compra realizada com sucesso!");
          setOpenDialog(false); // Fecha a janela de confirmação
        } catch (err) {
          console.error("Erro ao realizar a compra:", err);
          alert("Erro ao realizar a compra");
        }
      }
    }
  };
 

  // Função para cancelar e resetar o formulário
  const handleCancelSale = () => {
    setOpenSaleForm(false);
    setNewSaleForm({ customer: "", selectedProducts: [{ productId: 0, quantity: 0 }] });
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography>Erro: {error}</Typography>;

  return (
    <Grid container spacing={3}>
      {sales.map((sale) => (
        <Grid item xs={12} md={4} lg={3} key={sale.id}>
          <BlankCard>
            <Tooltip title="Comprar">
              <Fab
                size="small"
                color="primary"
                sx={{ bottom: "15px", right: "15px", position: "absolute" }}
                onClick={() => {
                  setSelectedSaleId(sale.id);
                  setOpenDialog(true); // Abrir janela de confirmação
                }}
              >
                <IconBasket size="16" />
              </Fab>
            </Tooltip>
            <CardContent sx={{ p: 3, pt: 2 }}>
              <Typography variant="h6">{sale.customer}</Typography>
              <Typography color="textSecondary">
                {new Date(sale.saleDate).toLocaleDateString()}
              </Typography>
              {sale.products.map((saleProduct) => (
                <div key={saleProduct.id}>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Produto: {saleProduct.product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    SKU: {saleProduct.product.sku}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Quantidade disponível: {saleProduct.quantity}
                  </Typography>
                </div>
              ))}
              <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
                <Typography variant="h6">
                  R${" "}
                  {sale.products.reduce(
                    (total, saleProduct) =>
                      total + saleProduct.product.price * saleProduct.quantity,
                    0
                  ).toFixed(2)}
                </Typography>
              </Stack>
            </CardContent>
          </BlankCard>
        </Grid>
      ))}

      {/* Botão para abrir o formulário de criação de venda */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenSaleForm(true)}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        Criar Venda
      </Button>

      {/* Caixa de diálogo para confirmar compra */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar compra</DialogTitle>
        <DialogContent>
          <Typography>Deseja realizar a compra?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCompletePurchase} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Formulário de criação de venda */}
      <Dialog open={openSaleForm} onClose={handleCancelSale}>
        <DialogTitle>Nova Venda</DialogTitle>
        <DialogContent>
          <TextField
            label="Cliente"
            fullWidth
            value={newSaleForm.customer}
            onChange={(e) => setNewSaleForm({ ...newSaleForm, customer: e.target.value })}
            sx={{ mb: 2 }}
          />

          {newSaleForm.selectedProducts.map((product, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={6}>
                <Select
                  fullWidth
                  value={product.productId}
                  onChange={(e) => handleProductSelect(index, e.target.value as number)}
                  displayEmpty
                >
                  <MenuItem value={0} disabled>
                    Selecione um produto
                  </MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  type="number"
                  label="Quantidade"
                  value={product.quantity}
                  onChange={(e) =>
                    handleProductQuantityChange(index, parseInt(e.target.value, 10))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveProduct(index)}
                  disabled={newSaleForm.selectedProducts.length <= 1}
                >
                  <IconTrash size={16} />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button variant="outlined" fullWidth onClick={handleAddProduct}>
            Adicionar Produto
          </Button>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: R${calculateTotalAmount().toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSale}>Cancelar</Button>
          <Button onClick={handleCreateSale} color="primary">
            Criar Venda
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Blog;
