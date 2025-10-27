import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Service1Service } from '../service1.service';
import { Service2Service } from '../service2.service';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  totalOrders: number = 0;
  totalCartItems: number = 0;
  orderChart: any;
  cartChart: any;

  constructor(private orderService: Service2Service, private cartService: Service1Service) {}

  ngOnInit() {
    this.loadInitialData();
    
    // Subscribe to cart changes for real-time updates
    this.cartService.cart$.subscribe(() => {
      this.updateCartData();
      setTimeout(() => {
        if (this.cartChart) {
          this.createCartProductsPieChart();
        }
      }, 100);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createOrderProductsPieChart();
      this.createCartProductsPieChart();
    }, 1000);
  }

  loadInitialData() {
    this.totalOrders = this.orderService.get();
    this.updateCartData();
  }

  updateCartData() {
    this.totalCartItems = this.cartService.getCartLength();
  }

  createOrderProductsPieChart() {
    const canvas = document.getElementById('userOrderChart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.orderChart) this.orderChart.destroy();

    // Get user's orders
    const userOrders = this.orderService.getSomeOrders();
    
    if (userOrders.length === 0) {
      // Show no orders
      this.orderChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['No Orders Placed'],
          datasets: [{
            data: [1],
            backgroundColor: ['#e9ecef']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: 'My Orders by Product (Empty)'
            }
          }
        }
      });
      return;
    }

    // Count orders by product name
    const productCounts: { [key: string]: number } = {};
    userOrders.forEach(order => {
      const name = order.productName || 'Unknown Product';
      productCounts[name] = (productCounts[name] || 0) + 1;
    });

    const labels = Object.keys(productCounts);
    const data = Object.values(productCounts);
    const colors = ['#28a745', '#007bff', '#ffc107', '#dc3545', '#6f42c1', '#17a2b8'];

    this.orderChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { 
            position: 'bottom',
            labels: {
              padding: 15
            }
          },
          title: {
            display: true,
            text: `My Orders by Product (${this.totalOrders} orders)`
          }
        }
      }
    });
  }

  createCartProductsPieChart() {
    const canvas = document.getElementById('userCartChart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.cartChart) this.cartChart.destroy();

    const cartItems = this.cartService.getCart();

    if (cartItems.length === 0) {
      this.cartChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['No Items in Cart'],
          datasets: [{
            data: [1],
            backgroundColor: ['#e9ecef']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: 'My Cart Products (Empty)'
            }
          }
        }
      });
      return;
    }

    // Count products by name
    const productCounts: { [key: string]: number } = {};
    cartItems.forEach(item => {
      const name = item.productName || 'Unknown Product';
      productCounts[name] = (productCounts[name] || 0) + 1;
    });

    const labels = Object.keys(productCounts);
    const data = Object.values(productCounts);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    this.cartChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { 
            position: 'bottom',
            labels: {
              padding: 15
            }
          },
          title: {
            display: true,
            text: `My Cart Products (${this.totalCartItems} items)`
          }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.orderChart) this.orderChart.destroy();
    if (this.cartChart) this.cartChart.destroy();
  }
}