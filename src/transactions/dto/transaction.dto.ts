// src/transaction/dto/create-transaction.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { TransactionStatus, TransactionType } from '../entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';


export class CreateTransactionDto {
  @ApiProperty()
  @IsEnum(TransactionType)
  type: TransactionType;


  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;


  @ApiProperty()
  @IsOptional()
  receiverId?: number; // only required for transfers
}


export class UpdateTransactionStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}