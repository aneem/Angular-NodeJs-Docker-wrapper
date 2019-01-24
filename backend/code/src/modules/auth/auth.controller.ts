import {
  Controller,
  Get,
  Body,
  Post,
  UseGuards,
  Param,
  Req,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiUseTags,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { LoginChallenge } from './models/login.challenge.model';
import { ForgotPasswordChallenge } from './models/forgot.password.challenge.model';
import { responseCreator } from '../../helper/responsehelper';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../entity/user';

@Controller('authenticate')
@ApiUseTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  @ApiCreatedResponse({ description: '{"token":"xxxxxx"}' })
  @ApiBadRequestResponse({ description: 'Invalid Login Details' })
  @ApiOperation({ title: 'Login with username/password' })
  async login(@Body() challenge: LoginChallenge) {
    return this.authService.signIn(challenge);
  }

  @Post('forgot')
  @ApiCreatedResponse({ description: 'Successful' })
  @ApiOperation({ title: 'Send reset email to registered email' })
  async forgot(@Body() challenge: ForgotPasswordChallenge) {
    await this.authService.forgot(challenge);
    return responseCreator('Successful');
  }

  @Post('register')
  @ApiCreatedResponse({ description: 'User registered successfully.' })
  @ApiOperation({ title: 'Create new user' })
  async register(@Body() user: User) {
    await this.authService.register(user);
    return responseCreator('User registered successfully.');
  }

  @Get('check-unique/:username')
  @ApiCreatedResponse({ description: '{"result":"boolean"}' })
  @ApiOperation({ title: 'Check if username is registered in system' })
  async isUserNameUnique(@Param() param) {
    return { result: await this.authService.isUserNameUnique(param.username) };
  }

  @Get('check-unique-email/:email')
  @ApiOperation({ title: 'Check if email is registered in system' })
  @ApiCreatedResponse({ description: '{"result":"boolean"}' })
  async isEmailUnique(@Param() param) {
    return { result: await this.authService.isEmailUnique(param.email) };
  }

  @Get('refresh/token')
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ title: 'Extend time of an active valid jwt token' })
  async refreshToken(@Req() request: any) {
    return await this.authService.refreshToken(request.user.id);
  }
}
