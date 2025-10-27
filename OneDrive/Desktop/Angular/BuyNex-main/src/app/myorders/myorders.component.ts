import { Component, Input } from '@angular/core';
import { ListService } from '../list.service';
import { Service1Service } from '../service1.service';
import { Service2Service } from '../service2.service';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css']
})
export class MyordersComponent {
  @Input() cartItems: any[] = [];
  myOrders: any[] = [];
  username: string = '';

  constructor(private orderService: Service2Service,private s:ListService) {}
  orders: any[] = [];

  ngOnInit() {
    // ✅ Subscribe to shared orders$
     //this.orders = this.orderService.getOrders();
     debugger
     //this.orderService.getSomeOrders().subscribe(res => {
      //this.orders = res;
      this.orders = this.orderService.getSomeOrders();
      console.log('Orders in component:', this.orders);
      console.log(this.orders)
  }
}
  
