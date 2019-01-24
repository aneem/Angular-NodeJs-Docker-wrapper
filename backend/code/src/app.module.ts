import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './modules/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { MailService } from './service/mail/mail.service';
import { MealModule } from './modules/meal/meal.module';
import { EntityService } from './service/entity.service';
import { DbSeederService } from './service/dbSeeder.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    MealModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    MailService,
    DbSeederService,
  ],
})
export class AppModule {}
