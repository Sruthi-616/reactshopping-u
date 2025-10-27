import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent {
  changeForm!: FormGroup;
  users: any[] = [];
  currentUser: any;

  showOld: boolean = false;
  showNew: boolean = false;
  showConfirm: boolean = false;

  constructor(private fb: FormBuilder,private r:Router) {}

  ngOnInit() {
      this.users = JSON.parse(localStorage.getItem('users') || '[]');
      const username = localStorage.getItem('username') || '';
    
      this.currentUser = this.users.find(u => u.username === username);
    
      this.changeForm = this.fb.group({
        username: [{ value: this.currentUser.username, disabled: true }],
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      }, { validators: this.passwordMatchValidator });
    }
    

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePassword(field: string) {
    if (field === 'old') this.showOld = !this.showOld;
    else if (field === 'new') this.showNew = !this.showNew;
    else if (field === 'confirm') this.showConfirm = !this.showConfirm;
  }

  onSubmit() {
    if (this.changeForm.invalid) return;

    const { oldPassword, newPassword } = this.changeForm.getRawValue(); // getRawValue to include disabled username

    if (oldPassword !== this.currentUser.password) {
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
        title: "Password not Updated"
      });
      return;
    }

    // Update password
    this.currentUser.password = newPassword;
    localStorage.setItem('users', JSON.stringify(this.users));
    this.changeForm.reset({
      username: this.currentUser.username
    });
    this.r.navigateByUrl('')
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
    title: "Password Updated Successfully"
  });
  }
  log(){
    this.r.navigateByUrl('/dash')
  }
}
