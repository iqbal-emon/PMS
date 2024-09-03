import { NgFor } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  searchQuery: string = '';
  currentPage = 1;
  pageSize = 10;  // Default value
  totalPages = 0;
  maxPageButtons = 5;
  maxPageSize = 100;  // Maximum limit for page size
  productList: any[] = [];
  filteredProductList: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadProductList();
    this.searchProducts();
  }

  loadProductList() {
    const existingData = localStorage.getItem('productList');
    this.productList = existingData ? JSON.parse(existingData) : [];
  }

  navigateToAddProduct() {
    this.router.navigate(['/add-product']);
  }

  getTotalPrice(product: any): number {
    return product.quantity * product.unitPrice;
  }

  deleteProduct(index: number) {
    this.productList.splice(index, 1);
    this.updateProductList();
    this.searchProducts();
  }

  updateProduct(index: number) {
    // Logic to update the product
    this.productList.splice(index, 1); // Placeholder for actual update logic
    this.updateProductList();
    this.searchProducts();
  }

  searchProducts() {
    if (this.searchQuery) {
      this.filteredProductList = this.productList.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredProductList = [...this.productList];
    }
    this.updatePagination();
  }

  updatePageSize(event: Event) {
    const inputSize = +(event.target as HTMLInputElement).value;
    if (inputSize > 0 && inputSize <= this.maxPageSize) {
      this.pageSize = inputSize;
      this.updatePagination();
      this.currentPage = 1; // Reset to the first page when page size changes
    } else if (inputSize > this.maxPageSize) {
      this.pageSize = this.maxPageSize;
      this.updatePagination();
      this.currentPage = 1;
    }
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProductList.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  getPaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredProductList.slice(startIndex, endIndex);
  }

  changePage(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  get pageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const visiblePages = this.maxPageButtons;
    const startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + visiblePages - 1);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        pages.push('...');
      }
      pages.push(this.totalPages);
    }

    return pages;
  }

  private updateProductList() {
    localStorage.setItem('productList', JSON.stringify(this.productList));
  }
}
