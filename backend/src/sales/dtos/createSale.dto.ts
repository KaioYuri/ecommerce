import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleProductDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateSaleDto {
  @IsNotEmpty()
  @IsString()
  customer: string;

  @IsNotEmpty()
  @IsString()
  saleDate: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleProductDto)
  products: SaleProductDto[];
}
