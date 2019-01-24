import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
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
import { MealService } from './meal.service';
import { Meal } from '../../entity/meal';
import { Roles } from '../../decorators/roles.decorator';

@Controller('meal')
@ApiUseTags('Meal')
@ApiForbiddenResponse({ description: 'Forbidden.' })
@UseGuards(AuthGuard(), RolesGuard)
@Roles('admin', 'user', 'user-manager')
@ApiBearerAuth()
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post('')
  @ApiCreatedResponse({ description: 'Meal successfully created.' })
  @ApiOperation({ title: 'Add meal' })
  async create(@Body() meal: Meal) {
    await this.mealService.create(meal);
    return responseCreator('Meal successfully created.');
  }

  @Put('')
  @ApiOperation({ title: 'Update meal' })
  @ApiCreatedResponse({ description: 'Meal successfully updated.' })
  async update(@Body() meal: Meal) {
    await this.mealService.update(meal);
    return responseCreator('Meal successfully updated.');
  }

  @Delete(':id')
  @ApiOperation({ title: 'Delete meal by id' })
  @ApiCreatedResponse({ description: 'Meal successfully deleted.' })
  @ApiImplicitParam({
    name: 'id',
    description: 'meal id',
    required: true,
    type: number,
  })
  async deleteUser(@Param() params) {
    await this.mealService.deleteById(params.id);
    return responseCreator('Meal successfully deleted.');
  }

  @Get('')
  @ApiOperation({ title: 'Fetch all meals' })
  async getAll(@Query() query) {
    return this.mealService.getMany(query);
  }

  @ApiImplicitParam({
    name: 'id',
    description: 'meal id',
    required: true,
    type: number,
  })
  @Get(':id')
  @ApiOperation({ title: 'Fetch meal by id' })
  async getOne(@Param() params) {
    return this.mealService.getOneById(params.id);
  }

  @ApiImplicitParam({
    name: 'userid',
    description: 'user id',
    required: true,
    type: number,
  })
  @Get('/user/:userid')
  @ApiOperation({ title: 'Fetch meal by user id' })
  async getMealByUserId(@Param() params) {
    return this.mealService.getMealByUserId(params.userid);
  }
}
