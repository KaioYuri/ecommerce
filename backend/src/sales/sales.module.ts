import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleProduct } from './entities/saleProduct.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleProduct])],
  providers: [SalesService],
  controllers: [SalesController],
  exports: [SalesService]
})
export class SalesModule {}
