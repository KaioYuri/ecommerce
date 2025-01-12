import { IsNotEmpty, IsString, IsDate, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SaleProductDto } from './createSale.dto';

export class UpdateSaleDto {
  @IsNotEmpty()
  @IsString()
  customer: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  saleDate: Date;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleProductDto)
  products: SaleProductDto[];
}
