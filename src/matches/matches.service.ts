import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  // 1. Create Match (Check if date is taken)
  async create(createMatchDto: CreateMatchDto) {
    const matchDate = new Date(createMatchDto.date);
    
    // Check the whole day (00:00 to 23:59)
    const startOfDay = new Date(matchDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(matchDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingMatch = await this.matchesRepository.findOne({
      where: { date: Between(startOfDay, endOfDay) },
    });

    if (existingMatch) {
      throw new BadRequestException('A match is already scheduled for this day!');
    }

    return this.matchesRepository.save(createMatchDto);
  }

  // 2. Find All (Include participants)
  findAll() {
    return this.matchesRepository.find({ relations: ['participants'] });
  }

  findOne(id: number) {
    return this.matchesRepository.findOne({ 
      where: { id },
      relations: ['participants'] 
    });
  }

  // 3. Update (For scores)
  async update(id: number, updateData: any) {
    return this.matchesRepository.update(id, updateData);
  }

  // 4. Join Match (Player)
  async joinMatch(matchId: number, userId: number) {
    const match = await this.findOne(matchId);
    if (!match) throw new NotFoundException('Match not found');

    const isAlreadyJoined = match.participants.some((u) => u.id === userId);
    if (!isAlreadyJoined) {
      match.participants.push({ id: userId } as User); // Add user by ID
      return this.matchesRepository.save(match);
    }
    return match;
  }

  // 5. Leave Match (Player)
  async leaveMatch(matchId: number, userId: number) {
    const match = await this.findOne(matchId);
    if (!match) throw new NotFoundException('Match not found');

    match.participants = match.participants.filter((u) => u.id !== userId);
    return this.matchesRepository.save(match);
  }
}