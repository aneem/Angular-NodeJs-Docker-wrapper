import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt.strategy';
import { LoginChallenge } from './models/login.challenge.model';
import { ForgotPasswordChallenge } from './models/forgot.password.challenge.model';
import { MailService } from '../../service/mail/mail.service';
import * as resetPasswordTemplate from '../../service/mail/mailTemplates/resetPassword';
import * as changePasswordTemplate from '../../service/mail/mailTemplates/changePassword';
import { PasswordService } from '../user/password.service';
import { LoginResponse } from './models/login.response.model';
import { ChangePasswordChallenge } from './models/change.password.model';
import { User } from '../../entity/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly passwordService: PasswordService,
  ) {}

  async signIn(challenge: LoginChallenge) {
    const user = await this.userService.getUserForChallenge(challenge);
    if (!user) {
      throw new BadRequestException('Invalid Login Details');
    }
    return {
      token: this.jwtService.sign(
        { ...user, password: undefined },
        { subject: user.userName },
      ),
    } as LoginResponse;
  }

  async refreshToken(userId: number) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      token: this.jwtService.sign(
        { ...user, password: undefined },
        { subject: user.userName },
      ),
    } as LoginResponse;
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return this.userService.getUserByEmail(payload.email);
  }

  async forgot(challenge: ForgotPasswordChallenge) {
    const user =
      challenge.email &&
      (await this.userService.getUserByEmail(challenge.email));
    if (!user) {
      return;
    }
    const newPassword = this.passwordService.createRandomPassword();
    const placeholder = new Map<string, string>();
    placeholder.set('userName', user.firstName);
    placeholder.set('newPassword', newPassword);

    await this.mailService.sendEmail({
      to: user.email,
      subject: resetPasswordTemplate.subject,
      html: this.mailService.replacePlaceholder(
        String(resetPasswordTemplate.html),
        placeholder,
      ),
    });
    user.password = this.passwordService.createPasswordHash(newPassword);
    await user.save();
  }

  async register(user: User) {
    return this.userService.createUser(user);
  }

  async isUserNameUnique(userName: string) {
    return this.userService.isUserNameUnique(userName);
  }

  async isEmailUnique(email: string) {
    return this.userService.isEmailUnique(email);
  }
}
