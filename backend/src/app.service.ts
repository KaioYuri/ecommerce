import { Injectable } from '@nestjs/common';
import { SalesService } from './sales/sales.service';
import { PurchasesService } from './purchases/purchases.service';

@Injectable()
export class AppService {
  constructor(
    private readonly salesService: SalesService, 
    private readonly purchasesService: PurchasesService
  ) {}

  // Método para obter todas as vendas e compras
  async getSalesAndPurchases() {
    const sales = await this.salesService.findAll();  // Recupera todas as vendas
    const purchases = await this.purchasesService.findAll();  // Recupera todas as compras
    return { sales, purchases };  // Retorna um objeto com as vendas e compras
  }
}
