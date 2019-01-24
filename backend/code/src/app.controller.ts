import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { responseCreator } from './helper/responsehelper';

@Controller('')
export class AppController {
  @Get('')
  @ApiExcludeEndpoint()
  getHello() {
    return responseCreator('Welcome to Calorie Meter');
  }
}
