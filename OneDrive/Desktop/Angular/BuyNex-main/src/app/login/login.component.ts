import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  forgotForm!: FormGroup;
  showPassword = false;
  showRegister = false;
  showForgot = false;

  // ✅ Mock user list
  users = [
    { username: 'admin1', password: 'admin123', role: 'Admin' },
    { username: 'sruthi', password: 'sruthi123', role: 'User' },
    { username: 'divya', password: 'divya2024', role: 'User' }
  ];

  constructor(private fb: FormBuilder,private router:Router) {}

  ngOnInit() {
    console.log(this.users);
  
    // Load saved users from localStorage (if any)
    const storedUsers: any[] = JSON.parse(localStorage.getItem('users') || '[]');
    if (storedUsers.length > 0) {
      this.users = storedUsers; // overwrite default users with stored ones
    }
  
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      
    });
  
    this.forgotForm = this.fb.group({
      username: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  

  // Password match check for Forgot Password form
  passwordMatchValidator(control: AbstractControl) {
    const newPass = control.get('newPassword')?.value;
    const confirmPass = control.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { passwordMismatch: true };
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  togglePassword() { this.showPassword = !this.showPassword;}
  toggleRegister() { this.showRegister = !this.showRegister; this.showForgot = false; this.loginForm.reset();
    this.registerForm.reset();
  
    this.loginForm.markAsPristine();
    this.registerForm.markAsPristine();
    this.forgotForm.markAsPristine();}
  toggleForgot() { this.showForgot = !this.showForgot; this.showRegister = false;   this.loginForm.reset();
    this.forgotForm.reset();
  
    this.loginForm.markAsPristine();
    this.registerForm.markAsPristine();
    this.forgotForm.markAsPristine();}

  // ✅ Login
  onSubmit() {
    const { username, password } = this.loginForm.value;
    const user = this.users.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('username', user.username);
      localStorage.setItem('role',user.role);
      localStorage.setItem('loggedInUser', JSON.stringify(user));

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
        title: "Login successfully"
      });
      
      localStorage.setItem('user', JSON.stringify({ username }));
      this.router.navigateByUrl('/dash');
    } else {
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
        icon: "error",
        title: "Check Username and Password"
      });
    }
  }

  // ✅ Register new user
  onRegisterSubmit() {
    const { username, password, role } = this.registerForm.value;
    const exists = this.users.some(u => u.username === username);
  
    if (exists) {
      Swal.fire({
        icon: 'warning',
        title: 'Username already exists',
        text: 'Please choose another username'
      });
    } else {
      // ✅ Push new user to users array
      this.users.push({ username, password, role });
  
      // ✅ Save updated users array to localStorage
      localStorage.setItem('users', JSON.stringify(this.users));
  
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
        title: "Registeration successfully"
      });
  
      console.log('Updated users:', this.users);
      this.showRegister = false;
      this.registerForm.reset();

    }
  
    // Optional: store role for reference
    localStorage.setItem('role', role);
  }
  

  // ✅ Forgot password update
  onForgotSubmit() {
    const { username, newPassword } = this.forgotForm.value;
    const user = this.users.find(u => u.username === username);

    if (user) {
      user.password = newPassword;
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
        title: "Password Updated"
      });
      console.log('Updated users:', this.users);
      this.showForgot = false;
      this.forgotForm.reset();
    } else {
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
        icon: "error",
        title: "Check Username"
      });
    }
  }
  resetForms() {
    // Reset login form
    this.loginForm.reset();
    
    // Reset register form
    this.registerForm.reset();
    
    // Reset forgot password form
    this.forgotForm.reset();
    
    // Hide password by default
    this.showPassword = true;
  }
  
}
