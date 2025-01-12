import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleProduct } from './entities/saleProduct.entity';
import { CreateSaleDto } from './dtos/createSale.dto';
import { UpdateSaleDto } from './dtos/updateSale.dto';
import { Repository } from 'typeorm';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,

    @InjectRepository(SaleProduct)
    private readonly saleProductRepository: Repository<SaleProduct>,
  ) {}

  // Criar uma venda
  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    // Criar a venda
    const sale = this.saleRepository.create({
      customer: createSaleDto.customer,
      saleDate: createSaleDto.saleDate,
    });

    // Salvar a venda
    const savedSale = await this.saleRepository.save(sale);

    // Criar os produtos da venda
    const saleProducts = createSaleDto.products.map(product =>
      this.saleProductRepository.create({
        sale: savedSale,
        product: { id: product.productId },
        quantity: product.quantity,
      }),
    );

    // Salvar os produtos da venda
    await this.saleProductRepository.save(saleProducts);

    // Associar os produtos à venda e retornar
    savedSale.products = saleProducts;
    return savedSale;
  }

  // Buscar todas as vendas
  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find({
      relations: ['products', 'products.product'],  // Associa produtos e produto
    });
  }

  // Buscar uma venda específica por ID
  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['products', 'products.product'],
    });

    if (!sale) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada`);
    }

    return sale;
  }

  // Atualizar uma venda existente
  async update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const existingSale = await this.saleRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!existingSale) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada`);
    }

    // Atualiza os dados da venda
    existingSale.customer = updateSaleDto.customer;
    existingSale.saleDate = updateSaleDto.saleDate;

    // Deletar os produtos antigos e adicionar os novos
    await this.saleProductRepository.delete({ sale: { id } });

    const updatedProducts = updateSaleDto.products.map(product =>
      this.saleProductRepository.create({
        sale: existingSale,
        product: { id: product.productId },
        quantity: product.quantity,
      }),
    );

    await this.saleProductRepository.save(updatedProducts);

    // Atualiza a venda com os novos produtos
    existingSale.products = updatedProducts;

    return this.saleRepository.save(existingSale);
  }

  // Remover uma venda
  async remove(id: number): Promise<void> {
    const sale = await this.saleRepository.findOne({ where: { id } });

    if (!sale) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada`);
    }

    await this.saleRepository.remove(sale);
  }
}
