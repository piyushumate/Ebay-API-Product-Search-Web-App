import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(arr: any, sortParam: string, nestedKey: string): any {
    let arr_copy  = JSON.parse(JSON.stringify(arr));
    let value = -1
    if(sortParam.length) {
        if (sortParam[0] == '-') {
            sortParam = sortParam.substring(1);
            value = 1;

        }
    }

    let castingFunction;

    if(sortParam == "" || sortParam == undefined) {
        return arr;
    } else if(sortParam == "title") {
        castingFunction = String;
    } else {
        castingFunction = Number;
    }

    let sort = function (nestedObj, prop, arr) {
        arr_copy.sort(function (a, b) {
              if(nestedObj == "" || nestedObj == undefined) {
                  if (castingFunction(a[prop]) < castingFunction(b[prop])) {
                      return value;
                  } else if (castingFunction(a[prop]) > castingFunction(b[prop])) {
                      return -value;
                  } else {
                      return 0;
                  }
              } else {
                  if (castingFunction(a[nestedObj][prop]) < castingFunction(b[nestedObj][prop])) {
                      return value;
                  } else if (castingFunction(a[nestedObj][prop]) > castingFunction(b[nestedObj][prop])) {
                      return -value;
                  } else {
                      return 0;
                  }
              }
          });
    };
    sort(nestedKey, sortParam, arr_copy);
    return arr_copy;
  }

}
