import { Component, OnInit, Input } from '@angular/core';
import { ProductSearch }  from '../product-search';
import { EbayApiService } from '../ebay-api.service';
import { DataService } from '../data.service';
import { TitleEllipsisPipe } from '../title-ellipsis.pipe';
import {ShippingFieldPipe} from "../shipping-field.pipe";
import {ActivatedRoute, Router} from "@angular/router";
import {hasOwnProperty} from "tslint/lib/utils";
import {LocalStorageService} from "../local-storage.service";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
    searchQuery: any;
    isLoading = true
    search_results;
    currentPage;
    itemsPerPage = 10;
    pageSize: number;
    error;
    shippingInfo;
    visitedProdInfo = null;

    constructor(private _ebay_api_service: EbayApiService,
                private _data_service: DataService,
                private router: Router,
                private activate_route: ActivatedRoute,
                private _local_storage: LocalStorageService) {
        console.log(this.currentPage);
        this.currentPage = 1;

        this._data_service.currentQuery.subscribe(data => {
            this.searchQuery = data;
            this.getProducts();
        })

        this._data_service.visitedProdInfo.subscribe(data => {
            this.visitedProdInfo = data
            if(this.visitedProdInfo) {
                if(this.visitedProdInfo.hasOwnProperty('page'))
                    this.currentPage = this.visitedProdInfo['page']
            }
        })
    }

    public onPageChange(pageNum: number): void {
        this.pageSize = this.itemsPerPage*(pageNum - 1);
    }

    public changePagesize(num: number): void {
        this.itemsPerPage = this.pageSize + num;
    }


    getProducts() {
        this.isLoading = true;
        this.search_results = null;
        this.error = null;
        if(this.searchQuery != undefined) {
            this._ebay_api_service.get_products(this.searchQuery).subscribe(
                response => {
                    //response["data"];
                    this.isLoading = false;

                    // this.currentPage = 1;
                    this.search_results = response["data"];
                },
                error => {
                    this.isLoading = false;
                    this.error = error["error"]["error"];
                })
        }
    }

    goToProductDetails(product) {
        this._data_service.changeProductInfo(product);
        this._data_service.changeVisitedProd({
            'page': this.currentPage,
            'product': product
        })
    }


    goToPrevProdDetails() {

        if(this.visitedProdInfo && this.visitedProdInfo.hasOwnProperty('product')) {
            this._data_service.changeProductInfo(this.visitedProdInfo['product']);
            this.router.navigate([this.visitedProdInfo['product']['Item ID']],
                                    {relativeTo: this.activate_route})

        }
    }

    ngOnInit() {

    }

}
