import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private cart = new BehaviorSubject<any>({});
  private purchases = new BehaviorSubject<any>({});

  currentCart = this.cart.asObservable();
  currentPurchases = this.purchases.asObservable();

  constructor() { }

  changeCart(cartVal: any) {
    this.cart.next(cartVal);
  }
  changePurchases(purchasesVal: any) {
    this.purchases.next(purchasesVal);
  }
}
