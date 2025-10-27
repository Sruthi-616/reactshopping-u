import { Component, OnInit } from '@angular/core';
import { ListService } from '..//list.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
declare var bootstrap: any; 
@Component({
  selector: 'app-product-list',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  products: any[] = [];
  productForm!: FormGroup;
  isEdit: boolean = false;
  selectedProductCode: string = '';
  
  // Pagination
  paginatedProducts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  
  // Sorting
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private listService: ListService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  initForm() {
    this.productForm = this.fb.group({
      productCode: ['', [Validators.required, Validators.minLength(3)]],
      productName: ['', [Validators.required, Validators.minLength(2)]],
      productPrice: [0, [Validators.required, Validators.min(1)]],
      productStatus: ['Active', Validators.required]
    });
  }

  loadProducts() {
    this.listService.products$.subscribe((res) => {
      this.products = res || [];
      this.updatePaginatedProducts();
    });
  }

  updatePaginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(start, end);
  }

  // Pagination methods
  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  nextPage() {
    if (this.currentPage < 3) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  // Modal methods
  openAddModal() {
    this.isEdit = false;
    this.productForm.reset({ productStatus: 'Active' });
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
  }

  openEditModal(product: any) {
    this.isEdit = true;
    this.selectedProductCode = product.productCode;
    this.productForm.patchValue(product);
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
  }

  saveProduct() {
    if (this.productForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.productForm.value;
    
    if (this.isEdit) {
      const updatedProduct = { ...formData, code: this.selectedProductCode };
      this.listService.updateProduct(updatedProduct);
      this.showSuccess('Product updated successfully');
    } else {
      this.listService.addProduct(formData);
      this.showSuccess('Product added successfully');
      //localStorage.setItem('products', JSON.stringify(addProduct));
      //localStorage.setItem('formData', JSON.stringify(this.formData));
    }
      //localStorage.setItem('formData', JSON.stringify(this.formData));
    this.closeModal();
  }

  deleteProduct(product: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Mark "${product.productName}" as Inactive?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Inactivate',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedProduct = { ...product, productStatus: 'Inactive', code: product.productCode };
        this.listService.updateProduct(updatedProduct);
        this.showSuccess('Product marked as inactive');
      }
    });
  }

  // Sorting - page wise only
  sortTable(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.paginatedProducts.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
      
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Helper methods
  setStatus(status: string) {
    this.productForm.get('productStatus')?.setValue(status);
  }

  closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal?.hide();
  }

  showSuccess(message: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 3000
    });
  }

  markFormGroupTouched() {
    Object.keys(this.productForm.controls).forEach(key => {
      this.productForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['min']) return `${fieldName} must be greater than ${field.errors['min'].min}`;
    }
    return '';
  }
}