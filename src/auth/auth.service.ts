import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { CreateCollectionOptions } from 'typeorm';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { CreateLoginDto } from './dto/auth.dto';
import { Response } from 'express';
import { CookieOptions } from 'express';



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






    
      async login(createLoginDto: CreateLoginDto, response: Response): Promise<any> {
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
          secure: false,        // Not secure, but may work temporarily
          sameSite: 'none',      // Less strict
          maxAge: 1000 * 60 * 60 * 24 * 7,
          path: '/',
        });
        
    
        
    
        // Create sanitized user object without password
        const sanitizedUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          balance: user.balance
        };
    
        return {
          user: sanitizedUser,
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
