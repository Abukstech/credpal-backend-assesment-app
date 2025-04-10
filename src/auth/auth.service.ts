import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { CreateCollectionOptions } from 'typeorm';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { CreateLoginDto } from './dto/auth.dto';
import { Response } from 'express';



@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService,
      ) {}

    
   

    async signup(CreateUserDto:CreateUserDto) {
        const user = await this.userService.create(CreateUserDto);
        return { message: 'User created', user };
      }






    
      async login(createLoginDto:CreateLoginDto,response:Response): Promise<any> {
        const user = await this.userService.findOneByEmail(createLoginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
          }
      
          const isValidPassword = await this.passwordService.comparePassword(
            createLoginDto.password,
            user.password,
          );
      
          if (!isValidPassword) {
            throw new UnauthorizedException('Invalid credentials');
          }

          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
          };

          const token = this.jwtService.sign(payload);

          response.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // use secure in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
          });


          return {
          
            user,
            token
          };

         

      
      }

      async logout(response: Response) {
        response.clearCookie('access_token');
        return {
          message: 'Logout successful'
        };
      }
}
