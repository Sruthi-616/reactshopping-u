import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Service1Service {
  private userCarts: { [username: string]: any[] } = {};
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadUserCartFromStorage();
  }

  private loadUserCartFromStorage() {
    const username = localStorage.getItem('username');
    if (username) {
      const stored = localStorage.getItem(`cart_${username}`);
      if (stored) {
        this.userCarts[username] = JSON.parse(stored);
        this.cartSubject.next([...this.userCarts[username]]);
      }
    }
  }

  addToCart(product: any) {
    const username = localStorage.getItem('username');
    if (!username) return;

    if (!this.userCarts[username]) {
      this.userCarts[username] = [];
    }

    const exists = this.userCarts[username].find(p => p.productCode === product.productCode);
    if (!exists) {
      this.userCarts[username].push(product);
      this.saveUserCart(username);
      this.cartSubject.next([...this.userCarts[username]]);
    }
  }

  removeFromCart(productCode: string) {
    const username = localStorage.getItem('username');
    if (!username) return;

    if (this.userCarts[username]) {
      this.userCarts[username] = this.userCarts[username].filter(p => p.productCode !== productCode);
      this.saveUserCart(username);
      this.cartSubject.next([...this.userCarts[username]]);
    }
  }

  getCart(): any[] {
    const username = localStorage.getItem('username');
    if (!username) return [];
    return this.userCarts[username] || [];
  }

  getCartLength(): number {
    const username = localStorage.getItem('username');
    if (!username) return 0;
    return (this.userCarts[username] || []).length;
  }

  private saveUserCart(username: string) {
    localStorage.setItem(`cart_${username}`, JSON.stringify(this.userCarts[username] || []));
  }
}