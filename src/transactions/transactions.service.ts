// src/transaction/transaction.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Transaction, TransactionType } from './entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateTransactionDto } from './dto/transaction.dto';

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
      receiver: receiver !,
    });

    return this.txnRepo.save(transaction);
  }


  async getBalance(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return { balance: user.balance };
  }
  
  async getTransactionHistory(userId: number) {
    return this.txnRepo.find({
      where: [
        { sender: { id: userId } },
        { receiver: { id: userId } },
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });
  }
}

