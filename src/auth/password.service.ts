import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hashPassword(password: string, salt: string): Promise<string> {
    // const saltRounds = 10;
    
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async checkPasswordStrength(password: string): Promise<boolean> {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&_]{8,}$/;

    return regex.test(password);
  }

}