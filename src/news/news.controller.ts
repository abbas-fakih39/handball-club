import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { AuthGuard } from '@nestjs/passport'; // Checks if logged in
import { RolesGuard } from '../auth/roles.guard'; // Checks for role
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // We will create this quickly below!

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // Requirement: Only "Contributor" can publish news 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONTRIBUTOR)
  @Post()
  create(@Body() createNewsDto: CreateNewsDto, @Request() req) {
    // req.user comes from the JWT token
    return this.newsService.create(createNewsDto, req.user);
  }

  // Requirement: Return all news 
  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }
}