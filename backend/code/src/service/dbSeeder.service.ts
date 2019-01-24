import { Injectable } from '@nestjs/common';
import { User } from '../entity/user';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class DbSeederService {
  constructor(private userService: UserService) {
    setTimeout(this.seedUsers, 30000);
  }
  users = {
    admin: new User({
      firstName: 'Darnell',
      middleName: 'M',
      lastName: 'Rollison',
      email: 'rebeka1980@yahoo.com',
      userName: 'admin',
      password: 'admin',
      role: 'admin',
      contactNumber: '412-896-7568',
      address: '4526 Lucky Duck Drive, Pittsburgh, Pennsylvania(PA), 1521',
      noOfDailyCalories: 1234,
    } as User),
    user: new User({
      firstName: 'Jerome',
      lastName: 'Carney',
      email: 'carmela_effer@yahoo.com',
      userName: 'user',
      password: 'user',
      role: 'user',
      contactNumber: '706-482-6755',
      address: '547 Limer Street,Dahlonega, Georgia(GA), 30533',
      noOfDailyCalories: 1234,
    } as User),
    userManager: new User({
      firstName: 'Robert',
      lastName: 'Yarbrough',
      email: 'odie2009@yahoo.com',
      userName: 'usermanager',
      password: 'usermanager',
      role: 'user-manager',
      contactNumber: '510-412-2279',
      address: '395 Thompson Drive, Richmond, California(CA), 94801',
      noOfDailyCalories: 1234,
    } as User),
  };

  seedUsers = async () => {
    if (await this.userService.isUserNameUnique(this.users.admin.userName)) {
      this.userService.createUser(this.users.admin);
    }
    if (await this.userService.isUserNameUnique(this.users.user.userName)) {
      this.userService.createUser(this.users.user);
    }
    if (
      await this.userService.isUserNameUnique(this.users.userManager.userName)
    ) {
      this.userService.createUser(this.users.userManager);
    }
  };
}
