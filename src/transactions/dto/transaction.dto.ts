// src/transaction/dto/create-transaction.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { TransactionStatus, TransactionType } from '../entities/transaction.entity';


export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  receiverId?: number; // only required for transfers
}


export class UpdateTransactionStatusDto {
  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}