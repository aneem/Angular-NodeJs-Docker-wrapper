import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  private randomPasswordLength = 6;
  private randomPasswordPossibleValues =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  createPasswordHash(password: string): string {
    return bcrypt.hashSync(password);
  }

  comparePasswords(password: string, storedPasswordHash: string) {
    return bcrypt.compareSync(password, storedPasswordHash);
  }

  createRandomPassword(): string {
    let text = '';
    for (let i = 0; i < this.randomPasswordLength; i++) {
      text += this.randomPasswordPossibleValues.charAt(
        Math.floor(Math.random() * this.randomPasswordPossibleValues.length),
      );
    }
    return text;
  }
}
