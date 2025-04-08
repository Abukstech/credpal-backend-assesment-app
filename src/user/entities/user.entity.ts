// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashed password

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number;

  
}
