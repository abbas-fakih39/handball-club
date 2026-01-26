import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  // Create: Coach Only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COACH)
  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  // Update Score: Coach Only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COACH)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.matchesService.update(+id, updateData);
  }

  // Join: Player Only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLAYER)
  @Post(':id/join')
  join(@Param('id') id: string, @Request() req) {
    return this.matchesService.joinMatch(+id, req.user.id);
  }

  // Leave: Player Only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLAYER)
  @Delete(':id/leave')
  leave(@Param('id') id: string, @Request() req) {
    return this.matchesService.leaveMatch(+id, req.user.id);
  }

  // Public: List all matches
  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }
}