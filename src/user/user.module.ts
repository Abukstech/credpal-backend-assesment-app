import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/auth/password.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';


require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    
   
   
  ],
  controllers: [UserController],
  providers: [UserService,JwtService,PasswordService]
})
export class UserModule {}
