import { Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../../products/entities/product.entity';
  
  @Entity('sale_products')
  export class SaleProduct {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Sale, (sale) => sale.products, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'saleId' })
    sale: Sale;
  
    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;
  
    @Column('int')
    quantity: number;
  }
  