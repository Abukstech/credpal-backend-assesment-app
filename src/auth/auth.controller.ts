import { Body, Controller, Post, Req, Res, Version } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/user.dto';
import HttpStatusCodes from 'src/utils/HttpStatusCodes';
import { AuthService } from './auth.service';
import { CreateLoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}


    @Version('1')
  @ApiOperation({ summary: 'Register a new User' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatusCodes.CREATED,
    description: 'User created successfully.',
  })
  @ApiResponse({
    status: HttpStatusCodes.BAD_REQUEST,
    description: 'Validation errors or bad request.',
  })
  @ApiResponse({
    status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Post('register')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      console.log('here')
      const data = await this.authService.signup(createUserDto);
      return res.status(HttpStatusCodes.CREATED).json({
        statusCode: HttpStatusCodes.CREATED,
        message: 'User created successfully',
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


  @Version('1')
  @ApiOperation({ summary: 'Login a new User' })
  @ApiBody({ type: CreateLoginDto })
  @ApiResponse({
    status: HttpStatusCodes.OK,
    description: 'User Logged in successfully.',
  })
  @ApiResponse({
    status: HttpStatusCodes.BAD_REQUEST,
    description: 'Validation errors or bad request.',
  })
  @ApiResponse({
    status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Post('login')
  async login(
    @Body() createLoginDto: CreateLoginDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      console.log('here')
      const data = await this.authService.login(createLoginDto);
      return res.status(HttpStatusCodes.OK).json({
        statusCode: HttpStatusCodes.OK,
        message: 'User Logged in successfully',
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
