import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dtos/createPurchase.dto';
import { UpdatePurchaseDto } from './dtos/updatePurchase.dto';
import { Purchase } from './entities/purchase.entity';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  // Criar nova compra
  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
    return this.purchasesService.create(createPurchaseDto);
  }

  // Buscar compras relacionadas a uma venda
  @Get('sale/:saleId')
  findAllBySale(@Param('saleId') saleId: number): Promise<Purchase[]> {
    return this.purchasesService.findAllBySale(saleId);
  }

  // Buscar compra específica
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Purchase> {
    return this.purchasesService.findOne(id);
  }

  // Buscar todas as compras
  @Get()
  findAll(): Promise<Purchase[]> {
    return this.purchasesService.findAll();
  }

  // Atualizar status da compra (Pendente, Cancelado, Completo)
  @Patch(':id/status')
  update(@Param('id') id: number, @Body() updatePurchaseDto: UpdatePurchaseDto): Promise<Purchase> {
    return this.purchasesService.update(id, updatePurchaseDto);
  }
}

