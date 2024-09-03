import { Routes } from '@angular/router';
import { CreateProductComponent } from '../features/products/create-product/create-product.component';
import { createComponent } from '@angular/core';
import { ProductListComponent } from '../features/products/product-list/product-list.component';


export const routes: Routes = [

    { path: '', component:ProductListComponent  },
    { path: 'add-product', component:CreateProductComponent  },
    { path: 'update-product/:index', component: CreateProductComponent },
];
