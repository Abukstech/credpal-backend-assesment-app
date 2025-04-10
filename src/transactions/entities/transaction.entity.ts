// src/transaction/transaction.entity.ts
import { User } from 'src/user/entities/user.entity';
import { generateUniqueTransactionId } from 'src/utils/generateNumber';

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';


export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
}

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  LIQUIDATED = 'liquidated',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    unique: true,
    length: 11,
    default: () => `'${generateUniqueTransactionId()}'` 
  })
  transactionId: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus,nullable: true })
  status: TransactionStatus;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value)
    }
  })
  amount: number;

  @ManyToOne(() => User, user => user.sentTransactions, { nullable: true })
  sender: User;

  @ManyToOne(() => User, user => user.receivedTransactions, { nullable: true })
  receiver: User;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'createdAt'
  })
  createdAt: Date;
}
