import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('User already exists', HttpStatus.BAD_REQUEST);
  }
}

export class OnlyAdminCanCreateAdminException extends HttpException {
  constructor() {
    super('Only Admin can create Admin', HttpStatus.FORBIDDEN);
  }
}

export class NoDoctorsFoundException extends HttpException {
  constructor(){
    super('No doctors found', HttpStatus.NOT_FOUND);
  }
}

export class PasswordTooWeakException extends HttpException {
  constructor() {
    super('Password is too weak', HttpStatus.BAD_REQUEST);
  }
}

export class PasswordsDoNotMatch extends HttpException {
  constructor() {
    super('Password and Confirm Password do not match', HttpStatus.BAD_REQUEST);
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}