import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EbayApiService} from "../ebay-api.service";
import {DataService} from "../data.service";
import { OrderByPipe } from '../order-by.pipe';
import {AppConstants} from "../app-constants";
import {LocalStorageService} from "../local-storage.service";
import {Location} from '@angular/common';
import {formatCurrency, getCurrencySymbol} from "@angular/common";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
    product_id;
    isLoading;
    product_details;
    main_product_details = <any>{};
    product_item_specifics = <any>{};
    main_product_keys = [
        "Product Images",
        "Subtitle",
        "Price",
        "Location",
        "Return_Policy_(US)"
    ]
    shipping_info: any;
    similar_items;
    sort_options = AppConstants.getSortParams();
    sortParam = "default";
    sortType = "asc";
    sortKey = "";
    nestedKey = "";
    isCollapsed = true;
    productPhotos;
    prodInfo;
  constructor(private route: ActivatedRoute,
              private _ebay_api_service: EbayApiService,
              private _data_service: DataService,
              private _local_storage: LocalStorageService,
              private _location: Location) {
      this._data_service.currentProdInfo.subscribe(data => {
          this.prodInfo = data;
          if (data) {
              this.shipping_info = data["Shipping"];
          }
      });

  }

  ngOnInit() {
      this.product_id = this.route.snapshot.paramMap.get('id');

      this.get_product_details()
      this.get_similar_items()
  }

    parse_product_details() {
        Object.keys(this.product_details).forEach(function(key) {
            if (this.main_product_keys.includes(key)) {
                this.main_product_details[key] = this.product_details[key]
            } else {
                if (!["Title", "Seller","Storefront", "Returns_Accepted", "item_url"]. includes(key)) {
                    this.product_item_specifics[key] = this.product_details[key]
                }
            }
        }.bind(this));
    }

    get_product_images(title) {
      console.log("comes inside get");
      console.log(title);
      this._ebay_api_service.get_product_images(title).subscribe(
          response => {
              this.productPhotos = response;
          }
      )
    }
    get_product_details() {
        this.isLoading = true;

        this._ebay_api_service.get_product(this.product_id).subscribe(
                response => {
                    this.isLoading = false;
                    this.product_details = response["data"];
                    if(this.product_details.hasOwnProperty('Title')) {
                        this.get_product_images(this.product_details['Title'])
                    }
                    console.log(this.product_details);
                    this.parse_product_details()
                },
                error => {
                    this.isLoading = false;
                    // this.error = error["error"]["error"];
                })
        }

    get_similar_items() {
        this._ebay_api_service.get_similar_items(this.product_id).subscribe(
            response => {
                this.similar_items = response["data"];
                console.log(this.similar_items);
            },
            error => {
                // this.error = error["error"]["error"];
            })
    }

    get_color(feedback_rating_start_color) {
        if (feedback_rating_start_color == 'None') {
            return 'white';
        } else if(feedback_rating_start_color.includes('Shooting')) {
            return feedback_rating_start_color.replace('Shooting', '');
        } else {
            return feedback_rating_start_color;
        }
    }


    sortOptionOnChange(value) {
      //update sortKey, nestedKey
      if(value == "default") {
          this.sortKey = "";
          this.nestedKey = "";
      } else if (value == "name") {
          this.sortKey = "title";
          this.nestedKey = "";
      } else if (value == "days_left") {
          this.sortKey = "days_left";
          this.nestedKey = "";
      } else if (value == "price") {
          this.sortKey = "__value__";
          this.nestedKey = "price";
      } else {
          this.sortKey = "__value__";
          this.nestedKey = "shipping_price";
      }

      //add minus sign to sortKey here based on sortType
      if (this.sortType == "desc" && value != "default") {
          this.sortKey = '-' + this.sortKey;
      }
    }

    sortTypeOnChange(value) {
      if(value == "asc") {
          this.sortKey = this.sortKey.replace('-', '');
      } else {
          this.sortKey = '-' + this.sortKey;
      }
    }

    toggleCollapsed() {
      this.isCollapsed = !this.isCollapsed;
    }
    // setSortParam(value) {
    //   if(value == "default") {
    //       this.sortParam = ""
    //       this.nestedKey = ""
    //   } else if (value == "product_name") {
    //       this.nestedKey= ""
    //   }
    // }

    backClicked() {
      this._location.back();
      console.log(this._location);
    }

    share_to_facebook() {

        let price = formatCurrency(
            this.product_details['Price']["__value__"],
            "en",
            getCurrencySymbol(this.product_details['Price']["@currencyId"], "narrow")
        );

        var quote_string = "Buy "+ this.product_details["Title"] + " at " + price + " from link below";

        var url = "https://www.facebook.com/dialog/share?app_id=867509633598269&display=popup&href=" +
            encodeURI(this.product_details["item_url"]) + "&quote=" + escape(quote_string);

        window.open(url);
    }

}


