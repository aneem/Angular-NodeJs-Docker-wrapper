import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { MailService } from '../../service/mail/mail.service';
import { PasswordService } from '../user/password.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.jwtSecretKey,
        signOptions: {
          expiresIn: configService.jwtExpiryTime,
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  exports: [],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService, PasswordService],
})
export class AuthModule {}
