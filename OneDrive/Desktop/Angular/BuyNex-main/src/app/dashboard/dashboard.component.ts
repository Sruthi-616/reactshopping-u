import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import Config from 'chart.js/dist/core/core.config';
import Swal from 'sweetalert2';
import { ListService } from '../list.service';
import { Service1Service } from '../service1.service';
import { Service2Service } from '../service2.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isSidebarOpen = false;
  username: string | null = null;
  role: string | null = null;
  totalProducts = 0;
  pieChart: any;
  activeProducts: number = 0;
  inactiveProducts: number = 0;
  isDashboardRoute = false;

  // Pie Chart config

  // Charts
  activeInactiveChart: any;
  productPriceChart: any;

  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'left' }
    }
  };

  pieChartLabels: string[] = ['Active', 'Inactive'];
  pieChartData: number[] = [];

  productPriceLabels: string[] = [];
  productPriceData: number[] = [];
  t:any;
  orderChart:any;
  p:any;
  orders:any;
  chart:any;
  config:any;
  PieChart:any;
  
  orderLabels: string[] = [];
  orderData: number[] = [];

  // ---- Cart Pie ----
  cartChart: any;
  cartLabels: string[] = [];
  cartData: number[] = [];

  // ---- User Order Summary Pie ----
  userOrderSummaryChart: any;

  totalOrders: number = 0;
  totalCartItems: number = 0;
  adminOrderChart:any;

  constructor(private router: Router,private r:ListService,private o:Service2Service,private res : Service1Service) {}
     ngOnInit() {
      this.username = localStorage.getItem('username');
      this.role = localStorage.getItem('role');
  
      if (!localStorage.getItem('user')) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please log in again.',
          confirmButtonColor: '#0d6efd'
        });
        this.router.navigateByUrl('');
      }
      this.r.products$.subscribe(products => {
        this.totalProducts = products.length;
        this.activeProducts = products.filter(p => p.productStatus === 'Active').length;
        this.inactiveProducts = products.filter(p => p.productStatus === 'Inactive').length;
      
        this.pieChartData = [this.activeProducts, this.inactiveProducts];
        if (this.activeInactiveChart) this.activeInactiveChart.destroy();

        // Create chart
      
        setTimeout(() => this.createActiveInactiveChart(), 0);
      
        // Orders (assuming synchronous)
      
        this.r.getProducts().subscribe(products => {
          this.totalProducts = products.length;
        
          // Products that have been ordered
          this.t = this.o.getAll();
          const orderedProductsCount = this.t;
          const notOrderedProductsCount = this.totalProducts - orderedProductsCount;
        
          // Update pie chart data
          this.orderLabels = ['Ordered Products', 'Not Ordered Products'];
          this.orderData = [orderedProductsCount, notOrderedProductsCount];
  
        });
        

    
      });
      if (this.role === 'Admin') {
        // Admin view - show all orders
        this.t = this.o.getAll();
        this.totalOrders = this.o.getAll();
        this.totalCartItems = this.getAllCartItems();
        this.load(); // Load all orders for admin chart
      } else {
        // User view - show only user's orders
        this.t = this.o.get();
        this.totalOrders = this.o.get();
        this.totalCartItems = this.res.getCartLength();
        this.loadOrders(); // Load user's orders for user chart
      }
      this.loadCart();
      this.createCartDistributionChart();
  }

  ngAfterViewInit() {
      setTimeout(() => {
        this.createActiveInactiveChart();
        this.createAdminOrderChart();// ✅ Added here
        this.createOrderPieChart();
        this.createCartDistributionChart();
      }, 500);
  }
  loadOrders() {
    const orders = this.o.getSomeOrders();
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
  load() {
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
  loadCart() {
    const cart = this.res.getCart();
    this.totalCartItems = cart.length;

    const cartCounts: { [key: string]: number } = {};
    cart.forEach(item => {
      const name = item.productName || 'Unknown';
      cartCounts[name] = (cartCounts[name] || 0) + 1;
    });

    this.cartLabels = Object.keys(cartCounts);
    this.cartData = Object.values(cartCounts);
  }

  getAllCartItems(): number {
    // For admin - this would need to aggregate all users' carts
    // For now, return 0 as admin doesn't have personal cart
    return 0;
  }
  createAdminOrderChart() {
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
  
    // Load order data based on role
    if (this.role === 'Admin') {
      this.load(); // All orders for admin
    } else {
      this.loadOrders(); // User orders for user
    }
  
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
  
   // ---- Pie Chart 3: Cart Items per Product ----
   createCartDistributionChart() {
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
          title: { display: true, text: 'Cart Items per Product' },
          legend: { position: 'bottom' }
        }
      }
    });
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
  ngOnDestroy() {
    
    if (this.cartChart) this.cartChart.destroy();
    if (this.activeInactiveChart) this.activeInactiveChart.destroy();
    if (this.userOrderSummaryChart) this.userOrderSummaryChart.destroy();
  }

  createActiveInactiveChart(): void {
    const canvas = document.getElementById('activeInactiveChart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    if (this.activeInactiveChart) this.activeInactiveChart.destroy();
  
    this.activeInactiveChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{ data: [this.activeProducts, this.inactiveProducts], backgroundColor: ['#28a745', '#dc3545'] }]
      },
      options: { responsive: true }
      
    });
}
toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('loggedInUser');

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
      title: "Logout successfully"
    });
    

    this.router.navigateByUrl('');
  }

  onProductsChange(count: number) {
    this.totalProducts = count;
    console.log('Received from child:', count);
  }

  get isDashboardPage(): boolean {
    return this.router.url === '/dash';
  }
  change(){
    this.router.navigateByUrl('/forgot');
  }
  

}
