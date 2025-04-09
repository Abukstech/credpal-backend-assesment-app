// src/transaction/dto/create-transaction.dto.ts
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';


export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  receiverId?: number; // only required for transfers
}
