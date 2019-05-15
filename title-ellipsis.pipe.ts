import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleEllipsis'
})
export class TitleEllipsisPipe implements PipeTransform {

  transform(input: string): any {
      const total = 35;
      if (input.length > total) {
          return (input.slice(0, total) + "...");
      }
      return (input);
  }

}
