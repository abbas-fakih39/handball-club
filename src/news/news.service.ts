import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  // We need to pass the 'author' (User) who is creating the news
  async create(createNewsDto: CreateNewsDto, author: User) {
    const news = this.newsRepository.create({
      ...createNewsDto,
      author, // Link the news to the user
    });
    return this.newsRepository.save(news);
  }

  findAll() {
    return this.newsRepository.find({ order: { publishedAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.newsRepository.findOne({ where: { id } });
  }
}