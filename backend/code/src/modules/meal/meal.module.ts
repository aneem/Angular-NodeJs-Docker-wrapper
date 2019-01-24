import { Module } from '@nestjs/common';
import { MealController } from './meal.controller';
import { PassportModule } from '@nestjs/passport';
import { MealService } from './meal.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [MealController],
  providers: [MealService],
  exports: [],
})
export class MealModule {}
