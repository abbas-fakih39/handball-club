import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  opponent: string;

  @Column({ type: 'datetime' }) // Stores date and time
  date: Date;

  @Column({ nullable: true }) // Score is optional (match might be in the future)
  homeScore: number;

  @Column({ nullable: true })
  awayScore: number;

  // Relationship: Many Players can join Many Matches
  @ManyToMany(() => User)
  @JoinTable() // Creates the link table automatically
  participants: User[];
}