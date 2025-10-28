import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private storageKey = 'products';
  constructor() { }
  productsArray = [
      {
        productCode: 'P001',
        productName: 'Wireless Mouse',
        productPrice: 799,
        productStatus: 'Active'
      },
      {
        productCode: 'P002',
        productName: 'Mechanical Keyboard',
        productPrice: 2499,
        productStatus: 'Active'
      },
      {
        productCode: 'P003',
        productName: 'Gaming Headset',
        productPrice: 1599,
        productStatus: 'Inactive'
      },
      {
        productCode: 'P004',
        productName: 'USB-C Charger',
        productPrice: 1199,
        productStatus: 'Active'
      },
      {
        productCode: 'P005',
        productName: 'Laptop Cooling Pad',
        productPrice: 999,
        productStatus: 'Inactive'
      }
    ];
    private productsSubject = new BehaviorSubject<any[]>([...this.productsArray]);

    // Observable to subscribe to
    products$ = this.productsSubject.asObservable();
  
  
    getProducts(){
      return of([...this.productsArray]);
    }
    private saveProductsToStorage(products: any[]): void {
      localStorage.setItem(this.storageKey, JSON.stringify(products));
      this.productsSubject.next(products);
    }
  
    delete(pid:any){
      const index=this.productsArray.findIndex((e)=>e.productCode==pid);
      if(index!=-1){
          this.productsArray.splice(index,1);
          this.productsSubject.next([...this.productsArray]); 
          return "Product Deleted Successfully"
      }
      else{
          return "Something Went Wrong"
      }
    }
    addProduct(product: any) {
      this.productsArray.push(product);
      this.productsSubject.next([...this.productsArray]); 
      //this.saveProductsToStorage(product);
    }
  
    updateProduct(updated: any) {
      const index = this.productsArray.findIndex(p => p.productCode === updated.code);
      if (index !== -1) {
        this.productsArray[index] = { ...updated };
        this.productsSubject.next([...this.productsArray]); 
      }
      //this.saveProductsToStorage(product);
    }
    getlen(){
      return of(this.productsArray.length)
    }
   length(){
    const totalLength = this.productsArray.length;      
    return totalLength;
   }
}
