import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule, MatInputModule} from '@angular/material';
import { SearchResultsComponent } from './search-results/search-results.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TitleEllipsisPipe } from './title-ellipsis.pipe';
import { ShippingFieldPipe } from './shipping-field.pipe';
import { WishListComponent } from './wish-list/wish-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { OrderByPipe } from './order-by.pipe';
import { PriceSumPipe } from './price-sum.pipe';


@NgModule({
  declarations: [
    AppComponent,
    SearchResultsComponent,
    TitleEllipsisPipe,
    ShippingFieldPipe,
    WishListComponent,
    ProductDetailsComponent,
    OrderByPipe,
    PriceSumPipe
  ],
  imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      MatAutocompleteModule,
      MatInputModule,
      NgbModule,
      RoundProgressModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

