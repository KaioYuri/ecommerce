import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesModule } from './sales/sales.module';
import { PurchasesModule } from './purchases/purchases.module';
import { SalesService } from './sales/sales.service';
import { PurchasesService } from './purchases/purchases.service';
import { ProductsService } from './products/products.service';
import { config } from './ormconfig';


@Module({
  imports: [
    TypeOrmModule.forRoot( config ),
    ProductsModule,
    SalesModule,
    PurchasesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
