import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
   imports: [
      TypeOrmModule.forFeature([User]),
      TypeOrmModule.forFeature([Transaction]),
      
     
     
    ],
  providers: [TransactionsService,JwtStrategy],
  controllers: [TransactionsController]
})
export class TransactionsModule {}
