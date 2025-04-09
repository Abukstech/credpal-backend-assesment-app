
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

export class CreateUserDto {

  @ApiProperty()
  @IsNotEmpty({ message: ' name is required' })
  @IsString({ message: ' name should be a string' })
  readonly name: string;






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


 

 

  
  // @ApiProperty()
  // @IsNotEmpty({ message: 'Role is required' })
  // @IsEnum(Role, {message: 'Role must be a valid enum value'})
  // readonly role: Role;

  

}
