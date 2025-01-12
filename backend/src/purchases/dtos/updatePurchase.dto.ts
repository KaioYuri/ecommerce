import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdatePurchaseDto {
  @IsNumber()
  @IsOptional()
  readonly price?: number;

  @IsNumber()
  @IsOptional()
  readonly quantity?: number;

  @IsString()
  @IsOptional()
  readonly purchaseDate?: string;

  @IsEnum(['Pendente', 'Completo', 'Cancelado'])
  @IsOptional()
  readonly status?: 'Pendente' | 'Completo' | 'Cancelado';

  @IsString()
  @IsOptional()
  readonly paymentDate?: string;

  @IsNumber()
  @IsOptional()
  readonly installments?: number;
}
