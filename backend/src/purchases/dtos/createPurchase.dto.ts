import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreatePurchaseDto {
  @IsNotEmpty() // Id da venda
  @IsNumber()
  saleId: number;

  @IsNotEmpty() // Id da compra
  @IsNumber()
  productId: number;

  @IsNotEmpty() // Preço do produto
  @IsNumber()
  price: number;

  @IsNotEmpty() // Quantidade que quer comprar
  @IsNumber()
  quantity: number;

  @IsNotEmpty() // Data da compra
  @IsString()
  purchaseDate: string;

  @IsEnum(['Pendente', 'Completo', 'Cancelado'])
  @IsOptional()  // Optional, caso não fornecido, 'Pendente' será o padrão
  status?: 'Pendente' | 'Completo' | 'Cancelado';

  @IsOptional()  // Nullable, para quando o pagamento ainda não foi realizado
  @IsString()
  paymentDate?: string;

  @IsOptional()  // Número de parcelas
  @IsNumber()
  installments?: number;
}
