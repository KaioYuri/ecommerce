'use client';

import { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Purchase } from '../../../../utils/types/types';
import { API_BASE_URL } from '@/app/apiConfig';

const ComprasPage = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(null);

  // Função para buscar as compras pendentes
  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/purchases`); 
        if (!response.ok) throw new Error('Erro ao buscar compras');
        const data: Purchase[] = await response.json();
        const pendingPurchases = data.filter((purchase) => purchase.status === 'Pendente');
        setPurchases(pendingPurchases);
      } catch (error) {
        console.error('Erro ao carregar as compras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  // Função para confirmar a conclusão da venda
  const handleConfirmCompletion = async () => {
    if (selectedPurchaseId !== null) {
      try {
        const response = await fetch(`${API_BASE_URL}/purchases/${selectedPurchaseId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Completo',
          }),
        });

        if (response.ok) {
          setPurchases((prevPurchases) =>
            prevPurchases.map((purchase) =>
              purchase.id === selectedPurchaseId
                ? { ...purchase, status: 'Completo' }
                : purchase
            )
          );
          setOpenDialog(false); // Fecha o diálogo após a confirmação
        } else {
          console.error('Erro ao atualizar o status da compra');
        }
      } catch (error) {
        console.error('Erro ao tentar concluir a venda:', error);
      }
    }
  };

  // Função para abrir o dialog de confirmação
  const handleOpenDialog = (purchaseId: number) => {
    setSelectedPurchaseId(purchaseId);
    setOpenDialog(true);
  };

  // Função para fechar o dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPurchaseId(null);
  };

  return (
    <PageContainer title="Compras Pendentes" description="Lista de compras pendentes">
      <DashboardCard title="Compras Pendentes">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : purchases.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data de pagamento</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.map((purchase: Purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.id}</TableCell>
                    <TableCell>{purchase.price}</TableCell>
                    <TableCell>{purchase.quantity}</TableCell>
                    <TableCell>{purchase.status}</TableCell>
                    <TableCell>{purchase.paymentDate}</TableCell>
                    <TableCell>
                      {purchase.status === 'Pendente' && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenDialog(purchase.id)}
                        >
                          Concluir Venda
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h6" align="center" mt={2}>
            Nenhuma compra pendente encontrada.
          </Typography>
        )}
      </DashboardCard>

      {/* Dialog de confirmação */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Conclusão de Venda</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Você tem certeza que deseja concluir esta venda?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmCompletion} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ComprasPage;
