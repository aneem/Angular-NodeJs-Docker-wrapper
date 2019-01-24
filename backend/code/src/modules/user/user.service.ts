import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PasswordService } from './password.service';
import { LoginChallenge } from '../auth/models/login.challenge.model';
import { ChangePasswordChallenge } from '../auth/models/change.password.model';
import { User } from '../../entity/user';

@Injectable()
export class UserService {
  constructor(private readonly passwordService: PasswordService) {}

  async updateUserOnly(user: User) {
    user = new User(user);
    delete user.password;
    return user.save();
  }

  async updateUserWithPassword(user: User) {
    user = new User(user);
    return user.save();
  }

  async deleteUser(user: User) {
    if (user) {
      user = new User(user);
      return user.remove();
    }
  }

  async deleteUserById(id: number) {
    return this.deleteUser(await this.getUserById(id));
  }

  async deleteUserByUserName(userName: string) {
    return this.deleteUser(await this.getUserByEmailOrUserName(userName));
  }

  async createUser(user: User) {
    user = new User(user);
    user.id = undefined;
    user.password = this.passwordService.createPasswordHash(user.password);
    return user.save();
  }

  async getUserById(id: number) {
    return User.createQueryBuilder('user')
      .where(
        `(user.deletedAt IS NULL OR user.deletedAt > NOW() ) AND (user.id= :id) `,
      )
      .setParameters({ id })
      .getOne();
  }

  async getUserByEmail(email: string) {
    return User.createQueryBuilder('user')
      .where(
        `(user.deletedAt IS NULL OR user.deletedAt > NOW() ) AND (user.email= :email) `,
      )
      .setParameters({ email })
      .getOne();
  }

  async getUserByEmailOrUserName(uid: string) {
    return User.createQueryBuilder('user')
      .where(
        `(user.deletedAt IS NULL OR user.deletedAt > NOW() ) AND (user.email= :uid OR user.userName= :uid) `,
      )
      .setParameters({ uid })
      .getOne();
  }

  async getUsers() {
    return User.createQueryBuilder('user')
      .where(`(user.deletedAt IS NULL OR user.deletedAt > NOW() ) `)
      .getMany();
  }

  async getUserForChallenge(challenge: LoginChallenge) {
    const user = await this.getUserByEmailOrUserName(challenge.userName);
    if (
      user &&
      this.passwordService.comparePasswords(challenge.password, user.password)
    ) {
      return user;
    }
  }

  async isUserNameUnique(userName: string) {
    return (
      (await User.createQueryBuilder('user')
        .where(
          `(user.deletedAt IS NULL OR user.deletedAt > NOW() ) AND (user.userName= :userName)`,
        )
        .setParameters({ userName })
        .getCount()) === 0
    );
  }

  async isEmailUnique(email: string) {
    return (
      (await User.createQueryBuilder('user')
        .where(
          `(user.deletedAt IS NULL OR user.deletedAt > NOW() ) AND (user.email= :email)`,
        )
        .setParameters({ email })
        .getCount()) === 0
    );
  }

  async changePassword(changePasswordChallenge: ChangePasswordChallenge) {
    const user = await this.getUserForChallenge({
      userName: changePasswordChallenge.userName,
      password: changePasswordChallenge.currentPassword,
    });
    if (!user) {
      throw new BadRequestException('current password mismatch');
    }
    user.password = this.passwordService.createPasswordHash(
      changePasswordChallenge.newPassword,
    );
    return this.updateUserWithPassword(user);
  }
}
