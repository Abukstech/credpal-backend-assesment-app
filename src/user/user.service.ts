import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/user.dto';
import { PasswordTooWeakException } from 'src/utils/exception';
import { PasswordService } from 'src/auth/password.service';
@Injectable()
export class UserService {


    constructor(
        @InjectRepository(User) private readonly authRepository: Repository<User>,
     
        private passwordService: PasswordService,
       
      ) { }

      async create(createUserDto: CreateUserDto, ): Promise<User> {
        // console.log(createUserDto)
        const user = await this.authRepository.findOne({ where: { email: createUserDto.email } });
        // console.log(createUserDto.email);
        if (user) {
          throw new Error ("Email Already Registered");
        }

        if (createUserDto.password != undefined && !this.passwordService.checkPasswordStrength(createUserDto.password)) {
            throw new PasswordTooWeakException();
          }
      
          const salt = await bcrypt.genSalt();
      
          const userProps:Omit<User,"id"|"sentTransactions"|"receivedTransactions"> = {
            ...createUserDto,
            password: createUserDto.password != undefined ? await this.passwordService.hashPassword(createUserDto.password, salt) : "",
            balance: 0,
          };

      const newUser   =  await this.authRepository.create(
            userProps
            
          );

          await this.authRepository.save(newUser);
          return newUser;



    }


    async findOneByEmail(email: string): Promise<User | null> {
        return await this.authRepository.findOne({ where: { email } });
      }


        async getBalance(userId: number) {
          const user = await this.authRepository.findOne({ where: { id: userId } });
          if (!user) throw new NotFoundException('User not found');
          return { balance: user.balance };
        }

      

}
