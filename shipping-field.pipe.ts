import { Pipe, PipeTransform } from '@angular/core';
import {formatCurrency, getCurrencySymbol} from "@angular/common";

@Pipe({
  name: 'shippingField'
})
export class ShippingFieldPipe implements PipeTransform {

  transform(value: any): any {
     if (value == undefined ||
         !('shippingServiceCost' in value) ||
         !value['shippingServiceCost'].length) {
         return "N/A";
     }
      let shipping = value["shippingServiceCost"][0]
      if (shipping == "N/A") {
          return shipping;
      } else {
          let val = parseFloat(shipping["__value__"]);
          if (!val) {
              return "Free Shipping";
          } else {
              return formatCurrency(
                  val, "en", getCurrencySymbol(shipping["@currencyId"], "narrow")
              );
          }
      }
  }

}
