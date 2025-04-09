// src/transaction/transaction.entity.ts
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';


export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
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
