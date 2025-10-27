import { Component, Input } from '@angular/core';
import { ListService } from '../list.service';
import { Service2Service } from '../service2.service';

@Component({
  selector: 'app-allorders',
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.css']
})
export class AllordersComponent {
  @Input() 
  allorders: any[] = [];

  constructor(private orderService:Service2Service,private s:ListService) {}
  
  ngOnInit() {
    // Subscribe to orders$ so admin sees all orders dynamically
   this.allorders = this.orderService.getOrders();
      console.log(this.allorders)
    
  }
 
  
}
