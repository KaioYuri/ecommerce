import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { SaleProduct } from './saleProduct.entity';
import { Purchase } from 'src/purchases/entities/purchase.entity';
  
  @Entity('sales')
  export class Sale {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    customer: string;
  
    @Column({ type: 'timestamp' })
    saleDate: Date;
  
    @OneToMany(() => SaleProduct, (saleProduct) => saleProduct.sale, {
      cascade: true,
    })
    @JoinColumn()
    products: SaleProduct[];

    @OneToMany(() => Purchase, purchase => purchase.sale)
    purchases: Purchase[];
  }
  