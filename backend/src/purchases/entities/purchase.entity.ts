import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Sale } from '../../sales/entities/sale.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, sale => sale.purchases)
  sale: Sale;

  @ManyToOne(() => Product)
  product: Product;

  @Column('decimal')
  price: number;

  @Column()
  quantity: number;

  @Column('date')
  purchaseDate: string;

  @Column({ type: 'enum', enum: ['Pendente', 'Completo', 'Cancelado'], default: 'Pendente' })
  status: 'Pendente' | 'Completo' | 'Cancelado';

  @Column({ nullable: true })
  paymentDate: string;

  @Column({ default: 1 })
  installments: number;  // Número de parcelas
}
