import { Pipe, PipeTransform } from '@angular/core';
import {formatCurrency, getCurrencySymbol} from "@angular/common";

@Pipe({
  name: 'priceSum'
})
export class PriceSumPipe implements PipeTransform {

  transform(products: any, args?: any): any {
      let total_sum = 0;
      let currency;
      for(let product_index in products) {
          total_sum += Number(products[product_index].Price["__value__"]);
          currency = products[product_index].Price["@currencyId"]
      }
      return formatCurrency(
          Number(total_sum.toFixed(2)), "en", getCurrencySymbol(
              currency, "narrow")
      );
  }

}
