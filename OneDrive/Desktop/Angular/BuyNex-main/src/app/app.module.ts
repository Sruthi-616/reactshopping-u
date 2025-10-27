import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LogoutComponent } from './logout/logout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';
import { ItemsComponent } from './items/items.component';
import { CartComponent } from './cart/cart.component';
import { AllordersComponent } from './allorders/allorders.component';
import { MyordersComponent } from './myorders/myorders.component';
import { ForgotComponent } from './forgot/forgot.component';
import { RegisterComponent } from './register/register.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    LogoutComponent,
    ProductComponent,
    ItemsComponent,
    CartComponent,
    AllordersComponent,
    MyordersComponent,
    ForgotComponent,
    RegisterComponent,
    UserdashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
     FormsModule,
     NgxPaginationModule
     ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
