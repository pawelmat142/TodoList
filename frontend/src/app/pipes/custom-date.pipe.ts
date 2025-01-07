import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(value: Date): String {
    let current = new Date();
    let deadline = new Date(value)

    if (
      deadline.getFullYear() === current.getFullYear()
      && deadline.getMonth() === current.getMonth()
    ) { 

      if (deadline.getDate() - current.getDate() === 1) return 'Jutro'
      if (deadline.getDate() - current.getDate() === 0) return 'Dziś'
      if (deadline.getDate() - current.getDate() < 0) return 'Minęło'
    }

    return value.toString();
  }

}
