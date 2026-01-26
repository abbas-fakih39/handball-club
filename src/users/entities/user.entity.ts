import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
  COACH = 'coach',
  CONTRIBUTOR = 'contributeur',
  PLAYER = 'joueur',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // We will hash this later

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.PLAYER
  })
  role: UserRole;

  @Column({ default: false })
  isValidated: boolean; // Brief says accounts must be validated by the club [cite: 27]

  @CreateDateColumn()
  createdAt: Date;
}