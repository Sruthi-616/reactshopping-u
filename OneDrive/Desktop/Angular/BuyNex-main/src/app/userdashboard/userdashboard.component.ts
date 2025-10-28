import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { Service1Service } from '../service1.service';
import { Service2Service } from '../service2.service';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent {
  totalOrders: number = 0;
  totalCartItems: number = 0;
  orderChart: any;
  cartChart: any;

  orderLabels: string[] = [];
  orderData: number[] = [];

  cartLabels: string[] = [];
  cartData: number[] = [];

  constructor(private orderService: Service2Service, private cartService: Service1Service) {}

  ngOnInit() {
    this.loadOrders();
    this.loadCart();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createOrderPieChart();
      this.createCartPieChart();
    }, 500);
  }

  loadOrders() {
    const orders = this.orderService.getSomeOrders();
    this.totalOrders = orders.length;

    // ✅ Count orders by product name
    const productCounts: { [key: string]: number } = {};
    orders.forEach(order => {
      const name = order.productName || 'Unknown';
      productCounts[name] = (productCounts[name] || 0) + 1;
    });

    this.orderLabels = Object.keys(productCounts);
    this.orderData = Object.values(productCounts);
  }

  loadCart() {
    this.totalCartItems = this.cartService.getCartLength();
  
    const cart = this.cartService.getCart(); // still needed for chart
    const cartCounts: { [key: string]: number } = {};
  
    cart.forEach(item => {
      const name = item.productName || 'Unknown';
      cartCounts[name] = (cartCounts[name] || 0) + 1;
    });
  
    this.cartLabels = Object.keys(cartCounts);
    this.cartData = Object.values(cartCounts);
  }
  

  createOrderPieChart() {
    const canvas = document.getElementById('orderChart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.orderChart) this.orderChart.destroy();

    this.orderChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.orderLabels,
        datasets: [{
          data: this.orderData,
          backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Orders per Product'
          },
          legend: { position: 'bottom' }
        }
      }
    });
  }

  createCartPieChart() {
    const canvas = document.getElementById('cartChart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.cartChart) this.cartChart.destroy();

    this.cartChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.cartLabels,
        datasets: [{
          data: this.cartData,
          backgroundColor: ['#17a2b8', '#ffc107', '#dc3545', '#28a745', '#6f42c1']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Cart Items per Product'
          },
          legend: { position: 'bottom' }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.orderChart) this.orderChart.destroy();
    if (this.cartChart) this.cartChart.destroy();
  }
}