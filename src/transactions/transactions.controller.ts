import { Body, Controller, Get, Post,Request} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transaction.dto';

@Controller('transactions')
export class TransactionsController {

    constructor(private readonly transactionService: TransactionsService) {}

    @Post()
    async create(@Body() dto: CreateTransactionDto, @Request() req) {
      return this.transactionService.createTransaction(req.user.userId, dto);
    }

    @Get('balance')
    async getBalance(@Request() req) {
      return this.transactionService.getBalance(req.user.userId);
    }
  
    @Get('history')
    async getTransactionHistory(@Request() req) {
      return this.transactionService.getTransactionHistory(req.user.userId);
    }
}
