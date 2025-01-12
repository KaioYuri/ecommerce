import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase])],
  providers: [PurchasesService],
  controllers: [PurchasesController],
  exports: [PurchasesService]
})
export class PurchasesModule {}
