import { Component, OnInit, Injectable } from '@angular/core';
import { EbayApiService } from './ebay-api.service';
import { DataService } from './data.service';
import { AppConstants } from './app-constants';
import { ProductSearch }  from './product-search';
import { _ } from 'underscore';
import {RouterOutlet, ActivatedRoute, Router} from "@angular/router";
import {slideInAnimation} from "./animations";
import {hasOwnProperty} from "tslint/lib/utils";
import {Event, NavigationEnd} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ slideInAnimation ]
})

export class AppComponent implements OnInit {
  title = 'client';
  categories = AppConstants.getCategories();
  zip_code = null;
  zip_codes;
  request_json;

  constructor(private _ebay_api_service: EbayApiService,
              private _data_service: DataService,
              private router: Router) {}

    searchModel = new ProductSearch(
        '',
        this.categories ? this.categories[0] : {},
        {"New": false, "Used": false, "Unspecified": false},
        {"LocalPickupOnly": false, "FreeShippingOnly": false},
        "10",
        "",
        "curr_location"
    );



    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }


  ngOnInit() {
      this._data_service.currentQuery.subscribe(request_json => this.request_json = request_json)
      this._ebay_api_service.get_current_zip_code(AppConstants.getGeoURL())
          .subscribe(
              data => {
                  if ("zip" in data) {
                      this.zip_code = data["zip"]
                  }
              },
              error => console.log("Error", error)
          )
  }

  validate(model) {
      if (model.location === "curr_location") {
          return false;
      } else {
          return !(/^[0-9]{5}$/.test(model.zip_code));
      }
  }

  get_zip_codes() {
        this._ebay_api_service.get_zip_codes(
            this.searchModel.zip_code
        ).subscribe(response => {
            this.zip_codes = response["data"]
        })
  }


  onSubmit() {

      this.request_json = Object.assign({}, this.searchModel);
      this.request_json["condition"] = Object.keys(_.pick(this.request_json["condition"], function(value, key) {
          return value
      }));

      this.request_json["category"] = this.request_json["category"]["key"]
      if (this.request_json.zip_code == "")
        this.request_json["zip_code"] = this.zip_code;
      this._data_service.changeQuery(this.request_json);
  }



  formReset(form){
        form.resetForm({
            'keyword':'',
            'category': this.categories ? this.categories[0] : {},
            'new' : false, 'used': false, 'unspecified': false,
            'pickup': false, 'shipping': false,
            'distance': "10",
            'zip_code_input': "",
            'from': "curr_location"
        })
        this.request_json = null
        this._data_service.changeQuery(this.request_json);
        this.router.navigate(['results'])
  }
}

