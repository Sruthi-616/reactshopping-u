import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Service1Service {

  constructor() { }
  //cart:any[]=[]
//addtocart(product:any){
    //this.cart.push(pobj);
//return "Add to Cart"
//const exists = this.cart.find(p => p.code === product.code);
    //if (!exists) {
      //this.cart.push(product);
   // }
    //return "Product added to cart";
  //}
  //getCartItems(){
    //return of(this.cart)
  //}
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable(); // Observable for components

  addToCart(product: any) {
    const currentCart = this.cartSubject.getValue();
    const username = localStorage.getItem('username');
    const productWithUser = { ...product, userName: username };
    const exists = currentCart.find(p => p.productCode === product.productCode && p.userName === username);
    if (!exists) {
      this.cartSubject.next([...currentCart, productWithUser]);
    }
  }

  removeFromCart(productCode: string) {
    const currentCart = this.cartSubject.getValue();
    const username = localStorage.getItem('username');
    this.cartSubject.next(currentCart.filter(p => !(p.productCode === productCode && p.userName === username)));
  }

  getCart(): any[] {
    const username = localStorage.getItem('username');
    return this.cartSubject.getValue().filter(item => item.userName === username);
  }

  getCartLength(): number {
    const username = localStorage.getItem('username');
    return this.cartSubject.getValue().filter(item => item.userName === username).length;
  }
  userCart:any;
  //getSomeOrders(): any[] {
    
    //const username = localStorage.getItem('username'); // ✅ get from localStorage
    //console.log(username)
   // const userOrders = this.cart$.filter(cart => cart.userName === username);
    //return userOrders;
  //}
  //get():number{
    //return this.getSomeOrders().length;
  //}
}

