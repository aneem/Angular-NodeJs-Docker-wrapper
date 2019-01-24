import { User } from './user.model';

export class Meal {
  name: string;
  description: string;
  calories: number;
  mealDateTime: Date;
  category: string;
  user?: User;
  userId?: number;
}
