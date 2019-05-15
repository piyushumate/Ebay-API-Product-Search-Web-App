import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import { ProductSearch }  from './product-search';

@Injectable({
  providedIn: 'root'
})
export class DataService {
    private querySource = new BehaviorSubject<any>(null)
    currentQuery = this.querySource.asObservable()

    private searchResProductInfo = new BehaviorSubject<any>(null)
    currentProdInfo = this.searchResProductInfo.asObservable()

    private visitedProd = new BehaviorSubject<any>(null)
    visitedProdInfo = this.visitedProd.asObservable()

    private visitedWishProd = new BehaviorSubject<any>(null)
    visitedWishProdInfo = this.visitedWishProd.asObservable()

    constructor() { }

    changeQuery(query : any) {
        this.querySource.next(query)
    }

    changeProductInfo(prod: any) {
        this.searchResProductInfo.next(prod)
    }

    changeVisitedProd(prod: any) {
        this.visitedProd.next(prod)
    }

    changeVisitedWishProd(prod: any) {
        this.visitedWishProd.next(prod)
    }

}
