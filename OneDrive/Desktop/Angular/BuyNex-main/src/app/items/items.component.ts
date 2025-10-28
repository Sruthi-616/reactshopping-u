import { Component, NgZone, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Service1Service } from '../service1.service';
import { Service2Service } from '../service2.service';

declare var bootstrap: any; // ✅ allows modal closing after order

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  products: any[] = [];
  cart: any[] = [];
  selectedProduct: any = null;
  buyNowForm!: FormGroup;
  username: string = '';
  zone:any;
  //private zone: NgZone;
  constructor(
    private listService: ListService,
    private fb: FormBuilder,
    private cartService: Service1Service,
    private orderService: Service2Service
  ) {}
  
  ngOnInit(): void {
    this.buyNowForm = this.fb.group({
      userName: [''],
      productName: [''],
      productPrice: [''],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')],Validators.maxLength(10)],
      address: ['', Validators.required]
    });
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.username = parsedUser.username;
      this.buyNowForm.patchValue({ userName: this.username });
      console.log(this.username)
    }

    this.listService.getProducts().subscribe((data: any) => {
      this.products = data;
    });
    
    this.cartService.cart$.subscribe(cart => (this.cart = cart));
  }


    addToCart(product: any) {
      const username = localStorage.getItem('username');
    
      if (!username) {
        Swal.fire({
          icon: 'warning',
          title: 'Login Required',
          text: 'Please log in before adding items to your cart.',
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
    
      // ✅ Use the service method instead of pushing locally
      const currentCart = this.cartService.getCart();
      const exists = currentCart.some(p => p.productCode === product.productCode);
    
      if (exists) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: `${product.productName} is already in your cart`,
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        this.cartService.addToCart(product); // ✅ Call service method
    
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `${product.productName} added to your cart`,
          showConfirmButton: false,
          timer: 2000
        });
      }
    }
  openBuyNow(product: any) {
    this.selectedProduct = { ...product };
    this.buyNowForm.patchValue({
      userName:this.username,
      productName: product.productName,
      productPrice: product.productPrice,
      //phoneNumber: '',
      //address: '',
    });
    this.zone.runOutsideAngular(() => {
      const modalEl = document.getElementById('buyNowModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    });
  }
  onOrder() {
    if (this.buyNowForm.invalid) {
      this.buyNowForm.markAllAsTouched();
      return;
    }
  
    const orderData = {
      ...this.buyNowForm.value,
      orderDate: new Date(),
      
    };
  
this.orderService.placeOrder(orderData).subscribe({
  next: (res) => {
    // Add to service array
    this.orderService.addOrder(orderData);
    const Toast = Swal.mixin({ 
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Order Placed successfully"
    });
  },
  error: (err) => {
    Swal.close();
    Swal.fire({
      icon: 'error',
      title: 'Error placing order',
      text: err.message
    });
  }
});
        // Close modal
 const modalEl = document.getElementById('buyNowModal');
 const modalInstance = bootstrap.Modal.getInstance(modalEl);
 modalInstance?.hide();
  
        // Reset form
 this.buyNowForm.reset();
 this.buyNowForm.patchValue({ userName: this.username });
  }
  }

  
