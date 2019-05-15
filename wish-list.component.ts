import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "../local-storage.service";
import {PriceSumPipe} from "../price-sum.pipe";
import {DataService} from "../data.service";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {
  products;
  is_loading;
  shippingInfo;
  visitedProdInfo;

  constructor(private _local_storage: LocalStorageService,
              private _data_service: DataService,
              private router: Router,
              private activate_route: ActivatedRoute) {
      this.is_loading = false
      this.products = _local_storage.get_products()
      // this._data_service.currentProdInfo.subscribe(data => {
      //     this.shippingInfo = data['Shipping'];
      // })

      this._data_service.visitedWishProdInfo.subscribe(data => {
          console.log(data);
          this.visitedProdInfo = data
      })
  }

  remove_product(item_id) {
     this._local_storage.remove_product(item_id);
     this.products = this._local_storage.get_products()
  }
  ngOnInit() {
      this.is_loading = true
  }

    goToProductDetails(product) {
        this._data_service.changeProductInfo(product);
        this._data_service.changeVisitedWishProd(product)
    }

    is_selected(curr_prod) {
      if (this.visitedProdInfo) {
          if (curr_prod['Item ID'] == this.visitedProdInfo['Item ID'])
              return true;
      }
      return false;
    }

    goToPrevProdDetails() {
        if(this.visitedProdInfo) {
            this._data_service.changeProductInfo(this.visitedProdInfo);

            this.router.navigate([this.visitedProdInfo['Item ID']],
                {relativeTo: this.activate_route})

        }
    }
}
