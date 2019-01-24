import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiUseTags,
  ApiForbiddenResponse,
  ApiCreatedResponse,
  ApiImplicitParam,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { number } from 'joi';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/role.guard';
import { responseCreator } from '../../helper/responsehelper';
import { ChangePasswordChallenge } from '../auth/models/change.password.model';
import { User } from '../../entity/user';
import { Roles } from '../../decorators/roles.decorator';

@Controller('user')
@ApiUseTags('User')
@ApiForbiddenResponse({ description: 'Forbidden.' })
@UseGuards(AuthGuard(), RolesGuard)
@Roles('admin', 'user-manager')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @ApiCreatedResponse({ description: 'User successfully created.' })
  @ApiOperation({ title: 'Add user' })
  async createUser(@Body() user: User) {
    await this.userService.createUser(user);
    return responseCreator('User successfully created.');
  }

  @Put('')
  @ApiOperation({ title: 'Update user' })
  @Roles('user')
  @ApiCreatedResponse({ description: 'User successfully updated.' })
  async updateUser(@Body() user: User) {
    await this.userService.updateUserOnly(user);
    return responseCreator('User successfully updated.');
  }

  @Delete(':id')
  @ApiOperation({ title: 'Delete user by id' })
  @ApiCreatedResponse({ description: 'User successfully deleted.' })
  @ApiImplicitParam({
    name: 'id',
    description: 'user id',
    required: true,
    type: number,
  })
  async deleteUser(@Param() params) {
    await this.userService.deleteUserById(params.id);
    return responseCreator('User successfully deleted.');
  }

  @Get('')
  @ApiOperation({ title: 'Fetch all users' })
  async getAllUser() {
    return this.userService.getUsers();
  }

  @ApiImplicitParam({
    name: 'id',
    description: 'user id',
    required: true,
    type: number,
  })
  @Get(':id')
  @ApiOperation({ title: 'Fetch user by id' })
  async getUser2(@Param() params) {
    return this.userService.getUserById(params.id);
  }

  @Delete('/username/:username')
  @ApiOperation({ title: 'Delete user by username' })
  @ApiCreatedResponse({ description: 'User successfully deleted.' })
  @ApiImplicitParam({
    name: 'username',
    description: 'user username',
    required: true,
    type: String,
  })
  async deleteUserByUserName(@Param() params) {
    await this.userService.deleteUserByUserName(params.username);
    return responseCreator('User successfully deleted.');
  }

  @ApiOperation({ title: 'Update existing user password' })
  @ApiCreatedResponse({ description: 'Password Changed Successfully.' })
  @Put('change-password')
  @Roles('user')
  async changePassword(@Body() body: ChangePasswordChallenge) {
    await this.userService.changePassword(body);
    return responseCreator('Password Changed Successfully.');
  }
}
