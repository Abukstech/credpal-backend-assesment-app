// src/transaction/transaction.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Transaction, TransactionStatus, TransactionType } from './entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateTransactionDto } from './dto/transaction.dto';
import { PaginationDto } from './dto/pagination.dto';
import { generateUniqueTransactionId } from 'src/utils/generateNumber';
import { SanitizedTransaction } from './types/transactionType';
;

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly txnRepo: Repository<Transaction>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createTransaction(senderId: number, dto: CreateTransactionDto) {
    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    if (!sender) throw new NotFoundException('Sender not found');

    const { type, amount, receiverId } = dto;

    let receiver: User | null = null;

    if (type === TransactionType.TRANSFER) {
      if (!receiverId) throw new BadRequestException('Receiver ID required for transfers');
      if (receiverId === senderId) throw new BadRequestException('Cannot transfer to self');
      receiver = await this.userRepo.findOne({ where: { id: receiverId } });
      if (!receiver) throw new NotFoundException('Receiver not found');
    }

    if (type !== TransactionType.DEPOSIT && sender.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Adjust balances
    if (type === TransactionType.DEPOSIT) {
      sender.balance += amount;
    } else if (type === TransactionType.WITHDRAWAL) {
      sender.balance -= amount;
    } else if (type === TransactionType.TRANSFER) {
      sender.balance -= amount;
      receiver!.balance += amount;
      await this.userRepo.save(receiver!);
    }

    await this.userRepo.save(sender);

    const transaction = this.txnRepo.create({
      type,
      amount,
      sender,
      receiver: receiver!,
      status:TransactionStatus.APPROVED,
      transactionId: generateUniqueTransactionId(),
    });

    const savedTransaction = await this.txnRepo.save(transaction);

    // Sanitize the response
    const sanitizedTransaction: SanitizedTransaction = {
        id: savedTransaction.id,
        transactionId: savedTransaction.transactionId,
        type: savedTransaction.type,
        amount: savedTransaction.amount,
        status: savedTransaction.status,
        createdAt: savedTransaction.createdAt,
        sender: savedTransaction.sender ? {
            id: savedTransaction.sender.id,
            name: savedTransaction.sender.name,
            email: savedTransaction.sender.email,
            balance: savedTransaction.sender.balance
        } : undefined,
        receiver: savedTransaction.receiver ? {
            id: savedTransaction.receiver.id,
            name: savedTransaction.receiver.name,
            email: savedTransaction.receiver.email,
            balance: savedTransaction.receiver.balance
        } : undefined
    };

    return sanitizedTransaction;
  }


  async getBalance(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return { balance: user.balance };
  }
  
  async getTransactionHistory(userId: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 2 } = paginationDto;
    const skip = Math.max(0, (page - 1) * limit);

    const [transactions, total] = await this.txnRepo
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.sender', 'sender')
        .leftJoinAndSelect('transaction.receiver', 'receiver')
        .where('(transaction.senderId = :userId OR transaction.receiverId = :userId)', 
              { userId: userId })
        .orderBy('transaction.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

    const sanitizedTransactions: SanitizedTransaction[] = transactions.map(transaction => {
        const sanitized: SanitizedTransaction = {
            id: transaction.id,
            transactionId: transaction.transactionId,
            type: transaction.type,
            amount: transaction.amount,
            status: transaction.status,
            createdAt: transaction.createdAt,
            sender: transaction.sender ? {
                id: transaction.sender.id,
                name: transaction.sender.name,
                email: transaction.sender.email,
                balance: transaction.sender.balance
            } : undefined,
            receiver: transaction.receiver ? {
                id: transaction.receiver.id,
                name: transaction.receiver.name,
                email: transaction.receiver.email,
                balance: transaction.receiver.balance
            } : undefined
        };
        return sanitized;
    });

    return {
        data: sanitizedTransactions,
        meta: {
            total,
            currentPage: page,
            itemsPerPage: limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: skip + limit < total,
            hasPreviousPage: page > 1
        }
    };
  }

  async updateTransactionStatus(transactionId: number, status: TransactionStatus) {
    const transaction = await this.txnRepo.findOne({
      where: { id: transactionId }
    });
  
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
  
    transaction.status = status;
    return await this.txnRepo.save(transaction);
  }
}


