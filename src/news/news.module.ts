import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import this
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { News } from './entities/news.entity'; // Import this

@Module({
  imports: [TypeOrmModule.forFeature([News])], // Add this
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}