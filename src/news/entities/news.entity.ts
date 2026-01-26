import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  publishedAt: Date;

  // Many News can belong to One User (The Author)
  @ManyToOne(() => User, (user) => user.id, { eager: true }) 
  author: User;
}