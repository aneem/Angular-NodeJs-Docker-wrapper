import { AbstractControl, ValidatorFn } from '@angular/forms';

const userNameRegex = /^[a-z0-1!@_.]*$/;
export function invalidUserNameCharCheck(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = !userNameRegex.test(control.value);
    return forbidden ? { invalidUserNameCharCheck: { message: 'Only alphanumeric and @,!,_,. values are allowed!' } } : null;
  };
}
