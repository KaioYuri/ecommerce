import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { CreatePurchaseDto } from './dtos/createPurchase.dto';
import { UpdatePurchaseDto } from './dtos/updatePurchase.dto';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,  // Usando o repositório da entidade diretamente
  ) {}

  // Criar nova compra
  async create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
    const purchase = this.purchaseRepository.create(createPurchaseDto);
    return this.purchaseRepository.save(purchase);
  }

  // Encontrar todas as compras
  async findAll(): Promise<Purchase[]> {
    return this.purchaseRepository.find();
  }

  // Encontrar compras por ID
  async findOne(id: number): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findOne({ where: { id } });
    if (!purchase) {
      throw new NotFoundException(`Compra com ID ${id} não encontrada`);
    }
    return purchase;
  }

  // Encontrar compras relacionadas a uma venda
  async findAllBySale(saleId: number): Promise<Purchase[]> {
    const purchases = await this.purchaseRepository.find({ where: { sale: { id: saleId } } });
    if (!purchases || purchases.length === 0) {
      throw new NotFoundException(`Nenhuma compra encontrada para a venda com ID ${saleId}`);
    }
    return purchases;
  }

  // Atualizar compra
  async update(id: number, updatePurchaseDto: UpdatePurchaseDto): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findOne({ where: { id } });
    if (!purchase) {
      throw new NotFoundException(`Compra com ID ${id} não encontrada`);
    }
    Object.assign(purchase, updatePurchaseDto);
    return this.purchaseRepository.save(purchase);
  }

  // Atualizar status da compra
  async updateStatus(id: number, status: 'Pendente' | 'Completo' | 'Cancelado'): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findOne({ where: { id } });
    if (!purchase) {
      throw new NotFoundException(`Compra com ID ${id} não encontrada`);
    }
    purchase.status = status;
    return this.purchaseRepository.save(purchase);
  }

  // Deletar compra
  async remove(id: number): Promise<void> {
    const purchase = await this.purchaseRepository.findOne({ where: { id } });
    if (!purchase) {
      throw new NotFoundException(`Compra com ID ${id} não encontrada`);
    }
    await this.purchaseRepository.remove(purchase);
  }
}
