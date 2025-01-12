import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('sales-purchases')
  async getSalesAndPurchases() {
    return this.appService.getSalesAndPurchases();
  }
}
