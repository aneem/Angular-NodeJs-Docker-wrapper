import { XBaseEntity } from '../entity/xBaseEntity';

export class EntityService<T extends XBaseEntity> {
  private type: any;
  constructor(type: new () => T) {
    this.type = type;
  }

  async save(t: T) {
    t = new this.type(t);
    return t.save();
  }

  async update(t: T) {
    t = new this.type(t);
    return t.save();
  }

  async delete(t: T) {
    if (t) {
      t = new this.type(t);
      return t.remove();
    }
  }

  async deleteById(id: number) {
    return this.delete(await this.getOneById(id));
  }

  async getOneById(id: number) {
    return this.type
      .createQueryBuilder('t')
      .where(`(t.deletedAt IS NULL OR t.deletedAt > NOW() ) AND (t.id= :id) `)
      .setParameters({ id })
      .getOne();
  }

  async getMany() {
    return this.type
      .createQueryBuilder('t')
      .where(`(t.deletedAt IS NULL OR t.deletedAt > NOW() ) `)
      .getMany();
  }
}
