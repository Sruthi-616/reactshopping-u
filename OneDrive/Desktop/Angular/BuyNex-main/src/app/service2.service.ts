import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Service2Service {
  private orders: any[] = [];
  private ordersSubject = new BehaviorSubject<any[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor() {
    this.loadOrdersFromStorage();
  }

  private loadOrdersFromStorage() {
    const stored = localStorage.getItem('allOrders');
    if (stored) {
      this.orders = JSON.parse(stored);
      this.ordersSubject.next([...this.orders]);
    }
  }

  private saveOrdersToStorage() {
    localStorage.setItem('allOrders', JSON.stringify(this.orders));
    this.ordersSubject.next([...this.orders]);
  }

  placeOrder(orderData: any): Observable<any> {
    return of(orderData);
  }

  addOrder(orderData: any) {
    // Add username to order data if not present
    const username = localStorage.getItem('username');
    const orderWithUser = { ...orderData, userName: username };
    
    this.orders.push(orderWithUser);
    this.saveOrdersToStorage();
    console.log('Order added:', orderWithUser);
  }

  // Get ALL orders (for admin dashboard)
  getOrders() {
    return [...this.orders];
  }

  // Get total count of ALL orders (for admin)
  getAll(): number {
    return this.orders.length;
  }

  // Get orders for current user only
  getSomeOrders(): any[] {
    const username = localStorage.getItem('username');
    if (!username) return [];
    
    const userOrders = this.orders.filter(order => order.userName === username);
    console.log(`Orders for ${username}:`, userOrders);
    return userOrders;
  }

  // Get count of current user's orders
  get(): number {
    return this.getSomeOrders().length;
  }

  getOrdersSnapshot(): any[] {
    return this.ordersSubject.getValue();
  }
}