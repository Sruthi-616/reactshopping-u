import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ListService } from '../list.service';
import { Service1Service } from '../service1.service';
import { Service2Service } from '../service2.service';
declare var bootstrap: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  products: any[] = [];
  selectedProduct: any = null;
  buyNowForm!: FormGroup;
  username: string = '';

  constructor(private cartService: Service1Service, private s: ListService, private fb: FormBuilder, private orderService: Service2Service) {}

  ngOnInit() {
    this.buyNowForm = this.fb.group({
      userName: [''],
      productName: [''],
      productPrice: [''],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')], Validators.maxLength(10)],
      address: ['', Validators.required]
    });
    
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.username = parsedUser.username;
      this.buyNowForm.patchValue({ userName: this.username });
    }

    this.s.getProducts().subscribe((data: any) => {
      this.products = data;
    });

    // Load user's cart and subscribe to changes
    this.loadUserCart();
    this.cartService.cart$.subscribe(() => {
      this.loadUserCart();
    });
  }

  loadUserCart() {
    this.cart = this.cartService.getCart();
    console.log('User cart loaded:', this.cart);
  }

  removeFromCart(productCode: string) {
    this.cartService.removeFromCart(productCode);
  }

  openBuyNow(product: any) {
    this.selectedProduct = { ...product };
    this.buyNowForm.patchValue({
      userName: this.username,
      productName: product.productName,
      productPrice: product.productPrice
    });
    const modalEl = document.getElementById('buyNowModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  onOrder() {
    if (this.buyNowForm.invalid) {
      this.buyNowForm.markAllAsTouched();
      return;
    }

    const orderData = {
      ...this.buyNowForm.value,
      orderDate: new Date()
    };

    this.orderService.placeOrder(orderData).subscribe({
      next: (res) => {
        this.orderService.addOrder(orderData);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Order Placed successfully",
          showConfirmButton: false,
          timer: 3000
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error placing order',
          text: err.message
        });
      }
    });

    const modalEl = document.getElementById('buyNowModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance?.hide();

    this.buyNowForm.reset();
    this.buyNowForm.patchValue({ userName: this.username });
  }
}