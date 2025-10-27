import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Service2Service {

  private orders: any[] = [];

  // Observable stream to share orders across components
  private ordersSubject = new BehaviorSubject<any[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor() { }

  placeOrder(orderData: any): Observable<any> {
    // Simulate async behavior
    return of(orderData);
  }

  addOrder(orderData: any) {
    this.orders.push(orderData);
    console.log(this.orders)
    this.ordersSubject.next(this.orders); // notify all subscribers (like OrdersComponent)
  }

  getOrders() {
    return this.orders;
  }
  getAll(){
    return this.orders.length;
  }
  getOrdersSnapshot(): any[] {
    return this.ordersSubject.getValue();
  }
  userOrders:any;
  getSomeOrders(): any[] {
    
    const username = localStorage.getItem('username'); // ✅ get from localStorage
    console.log(username)
    const userOrders = this.orders.filter(order => order.userName === username);
    return userOrders;
  }
  get():number{
    return this.getSomeOrders().length;
  }
}
