import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AllordersComponent } from './allorders/allorders.component';
import { CartComponent } from './cart/cart.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotComponent } from './forgot/forgot.component';
import { HomeComponent } from './home/home.component';
import { ItemsComponent } from './items/items.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { MyordersComponent } from './myorders/myorders.component';
import { ProductComponent } from './product/product.component';
import { RegisterComponent } from './register/register.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';

const routes: Routes = [
  {path:'', component : LoginComponent},
  {path:'dash',component: DashboardComponent,
  children :[
    {path:'home',component:HomeComponent},
    {path:'about',component:AboutComponent},
    {path:'contact',component: ContactComponent},
    {path:'logout',component:LogoutComponent},
    {path:'product',component:ProductComponent},
    {path:'items',component:ItemsComponent},
    {path:'cart',component:CartComponent},
    {path:'myorders',component:MyordersComponent},
    {path:'allorders',component:AllordersComponent},
    {path:'userdashboard',component:UserdashboardComponent}

  ]},
  {path:'forgot',component:ForgotComponent},
  {path:'register',component:RegisterComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
