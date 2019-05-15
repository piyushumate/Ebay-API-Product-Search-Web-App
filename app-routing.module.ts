import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchResultsComponent } from './search-results/search-results.component'
import { WishListComponent } from "./wish-list/wish-list.component";
import {ProductDetailsComponent} from "./product-details/product-details.component";

const routes: Routes = [
    {
        path: 'results',
        component: SearchResultsComponent,
        data: {animation: 'resultsPage'}
    },
    {
        path: 'wishlist',
        component: WishListComponent,
        data: {animation: 'wishlistPage'}
    },
    {
        path: 'results/:id',
        component: ProductDetailsComponent,
        data: {animation: 'productDetailsPage'}
    },
    {
        path: 'wishlist/:id',
        component: ProductDetailsComponent,
        data: {animation: 'productDetailsPage'}
    },
    {
        path: '',
        redirectTo: '/results',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

