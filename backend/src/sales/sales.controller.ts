import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto } from './dtos';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateSaleDto: UpdateSaleDto) {
    return await this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.salesService.remove(id);
  }
}
