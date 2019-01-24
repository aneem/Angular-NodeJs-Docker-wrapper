import { Meal } from '../../entity/meal';
import { EntityService } from '../../service/entity.service';
import { EntityManager, getManager } from 'typeorm';
import { format } from 'date-fns';
// export class MealService extends EntityService<Meal> {
export class MealService {
  create(entity: Meal) {
    entity = new Meal(entity);
    return entity.save();
  }

  update(entity: Meal) {
    return this.create(entity);
  }

  delete(entity: Meal) {
    if (entity) {
      entity = new Meal(entity);
      return entity.remove();
    }
  }

  async deleteById(id: number) {
    return this.delete(await this.getOneById(id));
  }

  async getOneById(id: number) {
    return Meal.createQueryBuilder('entity')
      .where(
        `(entity.deletedAt IS NULL OR entity.deletedAt > NOW() ) AND (entity.id= :id) `,
      )
      .setParameters({ id })
      .getOne();
  }

  async getMany(params?) {
    const queryParams = {
      fromDate:
        params.fromDate && format(params.fromDate, 'YYYY-MM-DD HH:mm:ss'),
      toDate: params.toDate && format(params.toDate, 'YYYY-MM-DD HH:mm:ss'),
      fromTime:
        params.fromTime && format(params.fromTime, 'YYYY-MM-DD HH:mm:ss'),
      toTime: params.toTime && format(params.toTime, 'YYYY-MM-DD HH:mm:ss'),
      userId: params.userId,
    };

    // we have to use the below hack as the typeorm parameters are only get replaced once
    return Meal.createQueryBuilder('entity')
      .where(
        `(entity.deletedAt IS NULL OR entity.deletedAt > NOW() )
         AND (:fromDate1 IS NULL OR cast(:fromDate2 AS DATE) <= cast(entity.mealDateTime AS DATE))
         AND (:toDate1 IS NULL OR cast(:toDate2 AS DATE) >= cast(entity.mealDateTime AS DATE))
         AND (:fromTime1 IS NULL OR cast(:fromTime2 AS TIME) <= cast(entity.mealDateTime AS TIME))
         AND (:toTime1 IS NULL OR cast(:toTime2 AS TIME) >= cast(entity.mealDateTime AS TIME))
         AND (entity.userId = :userId)
        `,
      )
      .setParameters({
        fromDate1: queryParams.fromDate,
        fromDate2: queryParams.fromDate,
        toDate1: queryParams.toDate,
        toDate2: queryParams.toDate,
        fromTime1: queryParams.fromTime,
        fromTime2: queryParams.fromTime,
        toTime1: queryParams.toTime,
        toTime2: queryParams.toTime,
        userId: queryParams.userId,
      })
      .getMany();
  }

  async getMealByUserId(userId: number) {
    return Meal.createQueryBuilder('entity')
      .where(
        `(entity.deletedAt IS NULL OR entity.deletedAt > NOW() ) AND (entity.userId=:userId)`,
      )
      .setParameters({ userId })
      .getMany();
  }
}
