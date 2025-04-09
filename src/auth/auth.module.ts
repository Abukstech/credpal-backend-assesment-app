import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { PasswordService } from './password.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [
      TypeOrmModule.forFeature([User]),
      ConfigModule,
      PassportModule,
      JwtModule.register({
        secret: process.env.JWT_SECRET || 'secret123',
        signOptions: { expiresIn: '1d' },
      }),
     
    ],
  controllers: [AuthController],
  providers: [AuthService,UserService,PasswordService]
})
export class AuthModule {}
