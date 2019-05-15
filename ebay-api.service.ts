import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})


export class EbayApiService {

  _url = 'http://csci571homework8-env.crc386dumd.us-east-2.elasticbeanstalk.com';

  constructor(private http: HttpClient) {}

  test() {
    return this.http.post<any>(this._url+'/product_images', JSON.stringify({'search_query': 'iphone'}));
  }

  get_current_zip_code(url) {
      return this.http.get(url);
  }

  get_zip_codes(zip) {
      return this.http.get<any>(this._url + '/get_zip?zip-code='+zip);
  }

  get_products(search_query) {
      console.log(search_query);
      return this.http.post(this._url+'/products', JSON.stringify(search_query), httpOptions)
  }

  get_product(product_id) {
      return this.http.get(this._url+'/product/'+product_id)
  }

  get_similar_items(product_id) {
      return this.http.get(this._url+'/similar_items/'+product_id)
  }

  get_product_images(product_name) {
      return this.http.post(this._url+'/product_images', JSON.stringify({
          'search_query': product_name}), httpOptions);
  }
}
