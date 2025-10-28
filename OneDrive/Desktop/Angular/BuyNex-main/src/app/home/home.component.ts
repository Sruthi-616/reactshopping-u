import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { ListService } from '../list.service';
import {  ChartType, ChartOptions } from 'chart.js';
import { Service2Service } from '../service2.service';
import { Service1Service } from '../service1.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  implements OnInit{
  totalProducts = 0;
  activeProducts = 0;
  inactiveProducts = 0;
  totalCartItems:any;
  activeInactiveChart: any;
  orderChart: any;
  pieChart:any;
  orderLabels: string[] = [];
  orderData: number[] = [];
  t: any;
 totalOrders:any;
 adminOrderChart:any;
  constructor(private r: ListService, private o: Service2Service,private res:Service1Service) {}

  ngOnInit(): void {
    this.r.getProducts().subscribe(products => {
      this.totalProducts = products.length;
      this.activeProducts = products.filter(p => p.productStatus === 'Active').length;
      this.inactiveProducts = products.filter(p => p.productStatus === 'Inactive').length;

      // Get order data
      this.t = this.o.getAll();
      if (Array.isArray(this.t) && this.t.length > 0) {
        this.orderLabels = this.t.map(p => p.productName);
        this.orderData = this.t.map(p => p.orderCount);
      }

      // ✅ Create chart AFTER data is ready and DOM is available
      setTimeout(() => this.createActiveInactiveChart(), 0);
      
      this.r.getProducts().subscribe(products => {
        this.totalProducts = products.length;
      
        // Products that have been ordered
        this.t = this.o.getAll();
        const orderedProductsCount = this.t;
        const notOrderedProductsCount = this.totalProducts - orderedProductsCount;
      
        // Update pie chart data
        this.orderLabels = ['Ordered Products', 'Not Ordered Products'];
        this.orderData = [orderedProductsCount, notOrderedProductsCount];
      
        // ✅ Re-create the chart after data is ready
        this.createadminOrderChart();

        this.totalCartItems=this.res.getCartLength();
        setTimeout(() => {
          this.createActiveInactiveChart();
          this.createadminOrderChart(); // fixed name
        }, 500);
    
      });
    });
  }
  orderPie:any;

  loadOrders() {
    const orders = this.o.getOrders();
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
  ngAfterViewInit(): void {
    // Safety: if data is already available early, chart will render
    if (this.activeProducts + this.inactiveProducts > 0) {
      this.createActiveInactiveChart();
    }
    this.createadminOrderChart();

  }
  createadminOrderChart() {
    const canvas = document.getElementById('orderPieChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn("orderPieChart canvas not found");
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn("orderPieChart context not found");
      return;
    }
  
    // Load latest order data (if not already loaded)
    this.loadOrders();
  
    // Wait a bit for async data (since getOrders() might fetch from service)
    setTimeout(() => {
      if (this.adminOrderChart) this.adminOrderChart.destroy();
  
      this.adminOrderChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.orderLabels.length ? this.orderLabels : ['No Orders'],
          datasets: [{
            data: this.orderData.length ? this.orderData : [0],
            backgroundColor: [
              '#dc3545','#28a745', 
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Orders per Product'
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }, 300);
  }
  
   // ---- Pie Chart 3: Cart Items per Pro
  
  createActiveInactiveChart(): void {
    const canvas = document.getElementById('activeInactiveChart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy old instance if any
    if (this.activeInactiveChart) this.activeInactiveChart.destroy();

    this.activeInactiveChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [
          {
            data: [this.activeProducts, this.inactiveProducts],
            backgroundColor: ['#28a745', '#dc3545']
          }
        ]
      },
      options: { responsive: true }
    });
  }

  ngOnDestroy(): void {
    // ✅ Cleanup chart when leaving route
    if (this.activeInactiveChart) this.activeInactiveChart.destroy();
  }
}