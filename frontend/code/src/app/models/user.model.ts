export class User {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string;
  noOfDailyCalories: number;

  middleName?: string;
  contactNumber?: string;
  address?: string;

  get displayName() {
    return this.firstName + this.middleName ? ` ${this.middleName} ` : ` ` + this.lastName;
  }
}
