import { Body, Controller, Get, Post,Request, UseGuards} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transaction.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {

    constructor(private readonly transactionService: TransactionsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
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
