
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateLoginDto {

 






  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email should be a string' })
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(8, { message: 'Password should be at least 5 characters long' })
  @IsString({ message: 'Password should be a string' })
  readonly password: string;


 

 

 

  

}