import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { FeedModule } from './feed/feed.module';
import { PostModule } from './post/post.module';
import * as dotenv from 'dotenv';
import { SavedPost } from './feed/entities/savedpost.entity';
import { Post } from './post/entities/post.entity';
dotenv.config(); 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env.development'
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, SavedPost, Post],
        synchronize: true, 
      }),
    }),
    AuthModule,
    FeedModule,
    PostModule,
  ],
})
export class AppModule {}
