import { Injectable } from '@angular/core';
import { _ } from 'underscore';
import {hasOwnProperty} from "tslint/lib/utils";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
      if (localStorage.getItem('wish_list') == null) {
          localStorage.setItem('wish_list', JSON.stringify({}));
      }
  }

  is_product(item_id) {
      let wish_list = localStorage.getItem('wish_list')
      if(wish_list != null) {
        wish_list = JSON.parse(wish_list)
        if(hasOwnProperty(wish_list, item_id)) {
            return true;
        }
      }
      return false;
  }

  set_product(obj, item_id: string) {
      let wish_list = localStorage.getItem('wish_list')
      if(wish_list != null) {
          wish_list = JSON.parse(wish_list)
          if(!hasOwnProperty(wish_list, item_id)) {
              wish_list[item_id] = obj
              localStorage.removeItem('wish_list')
              localStorage.setItem('wish_list', JSON.stringify(wish_list))
          }
      }
  }

  remove_product(item_id: string) {
      let wish_list = localStorage.getItem('wish_list')
      if(wish_list != null) {
          wish_list = JSON.parse(wish_list)
          if(hasOwnProperty(wish_list, item_id)) {
              delete wish_list[item_id]
              localStorage.removeItem('wish_list')
              localStorage.setItem('wish_list', JSON.stringify(wish_list))
          }
      }
  }

  get_products() {
      let wish_list = localStorage.getItem('wish_list')
      if(wish_list != null) {
          return Object.values(JSON.parse(wish_list))
      } else {
          localStorage.setItem('wish_list', JSON.stringify({}));
          return [];
      }
  }
}
