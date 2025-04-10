import { Body, Controller, Get, Post, Req, Res, UseGuards, Version } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateLoginDto } from 'src/auth/dto/auth.dto';
import HttpStatusCodes from 'src/utils/HttpStatusCodes';
import { Response } from 'express';

@Controller('user')
@ApiBearerAuth()

export class UserController {

    constructor(private readonly userService: UserService) {}



  @Version('1')
  @ApiOperation({ summary: 'Get User  Balance' })

  @ApiResponse({
    status: HttpStatusCodes.OK,
    description: 'Balance Fetched Succesfully.',
  })
  @ApiResponse({
    status: HttpStatusCodes.BAD_REQUEST,
    description: 'Validation errors or bad request.',
  })
  @ApiResponse({
    status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
     @Get('balance')
     @UseGuards(JwtAuthGuard)
        async getBalance(@Req() req, @Res() res: Response,) {
            try {
                console.log('here')
                const data=  await this.userService.getBalance(req.user.userId);
                return res.status(HttpStatusCodes.OK).json({
                  statusCode: HttpStatusCodes.OK,
                  message: 'Balance fetched successfully',
                  data,
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
}
