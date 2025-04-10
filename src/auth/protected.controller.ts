// Example protected controller
import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';


@Controller('protected')
@UseGuards(JwtAuthGuard) 
@ApiBearerAuth()
export class ProtectedController {
  @Get()
  getProtectedData() {
    return { message: 'This is protected data' };
  }
}