import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 33061,
        username: 'root',
        password: 'myorm',
        database: 'nestdb',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        retryAttempts: 8,
      }),
    }),
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
