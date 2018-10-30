import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'numberOfDays'
})
export class NumberOfDaysPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return `${moment.duration(value).days()} days`;
  }
}
