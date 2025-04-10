import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post,Query,Request, Res, UseGuards, Version} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionStatusDto } from './dto/transaction.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PaginationDto } from './dto/pagination.dto';
import HttpStatusCodes from 'src/utils/HttpStatusCodes';
import { Response } from 'express';
import { ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateLoginDto } from 'src/auth/dto/auth.dto';

@Controller('transactions')
@ApiBearerAuth()
export class TransactionsController {

    constructor(private readonly transactionService: TransactionsService) {}
    @Version('1')
    @ApiOperation({ summary: 'Create a new Transaction' })
    @ApiBody({ type: CreateTransactionDto })
    @ApiResponse({
      status: HttpStatusCodes.CREATED,
      description: 'Transaction created successfully.',
    })
    @ApiResponse({
      status: HttpStatusCodes.BAD_REQUEST,
      description: 'Validation errors or bad request.',
    })
    @ApiResponse({
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      description: 'Internal server error.',
    })
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: CreateTransactionDto, @Request() req, @Res() res: Response) {

      try {
    
        const transaction = await this.transactionService.createTransaction(req.user.userId, dto);
        return res.status(HttpStatusCodes.CREATED).json({
          statusCode: HttpStatusCodes.OK,
          message: 'Transaction Created successfully',
          data:transaction,
        });
      } catch (error) {
        const errorMessage =
          error.response?.message || error.message || 'Internal server error';
        const errorStatus =
          error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR;
        return res
          .status(errorStatus)
          .json({ statusCode: errorStatus, message: errorMessage });
      }
      

    }

    @Version('1')
    @ApiOperation({ summary: 'Get Transaction History' })
    @ApiQuery({ type: PaginationDto })
    @ApiResponse({
      status: HttpStatusCodes.OK,
      description: 'Transaction history fetched successfully.',
    })
    @ApiResponse({
      status: HttpStatusCodes.BAD_REQUEST,
      description: 'Validation errors or bad request.',
    })
    @ApiResponse({
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      description: 'Internal server error.',
    })
    @Get('history')
    @UseGuards(JwtAuthGuard)
    async getTransactionHistory(
      @Request() req,
      @Res() res: Response,
      @Query() paginationDto: PaginationDto
  ) {
try {
  console.log('here')
  const transactions=  await this.transactionService.getTransactionHistory(
    req.user.userId,
    paginationDto
);
  return res.status(HttpStatusCodes.OK).json({
    statusCode: HttpStatusCodes.OK,
    message: 'Transaction History fetched successfully',
    data:transactions,
  });
} catch (error) {
  const errorMessage =
    error.response?.message || error.message || 'Internal server error';
  const errorStatus =
    error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR;
  return res
    .status(errorStatus)
    .json({ statusCode: errorStatus, message: errorMessage });
}

      
 
  }

  

  @Patch(':id/status')

async updateStatus(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateStatusDto: UpdateTransactionStatusDto,
  @Request() req
) {
  return this.transactionService.updateTransactionStatus(id, updateStatusDto.status);
}

}




