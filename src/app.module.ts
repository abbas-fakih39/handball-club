import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'handball.db', // This file will be created automatically in your project root
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Auto-load entities we create later
      synchronize: true, // Auto-create tables (turn off in production, but great for dev)
    }),
    UsersModule,
    AuthModule,
    NewsModule,
    MatchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}