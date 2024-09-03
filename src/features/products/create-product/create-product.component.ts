import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'] // Corrected from 'styleUrl' to 'styleUrls'
})
export class CreateProductComponent {
  productForm: FormGroup;
  categories: string[] = ['Electronics', 'Apparel', 'Beauty Products', 'Home Decor'];
  newCategory: string = '';
  isUpdateMode: boolean = false;
  indexToUpdate: number | null = null;
  productList: any[] = [];
  constructor(private fb: FormBuilder,private router: Router,private route: ActivatedRoute) {
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      category: new FormControl(''),
      quantity: new FormControl(null, Validators.required),
      unitPrice: new FormControl('', Validators.required),
      createDate: new FormControl('')
    });
  }
  ngOnInit() {
    const index = this.route.snapshot.paramMap.get('index');
    if (index !== null) {
      this.isUpdateMode = true;
      this.indexToUpdate = +index;
      this.loadProductToUpdate(this.indexToUpdate);
    }
  }

  loadProductToUpdate(index: number) {
    const existingData = localStorage.getItem('productList');
    if (existingData) {
      this.productList = JSON.parse(existingData);
      const product = this.productList[index];
      if (product) {
        this.productForm.patchValue(product);
      }
    }
  }


  addCategory() {
    if (this.newCategory && !this.categories.includes(this.newCategory)) {
      this.categories.push(this.newCategory);
      this.productForm.get('category')?.setValue(this.newCategory);
      this.newCategory = '';
    }
  }
  onSubmit() {
    const formData = this.productForm.value;

    const existingData = localStorage.getItem('productList');
    this.productList = existingData ? JSON.parse(existingData) : [];

    if (this.isUpdateMode && this.indexToUpdate !== null) {
      this.productList[this.indexToUpdate] = formData;
    } else {
      this.productList.push(formData);
    }

    localStorage.setItem('productList', JSON.stringify(this.productList));
    // alert(this.isUpdateMode ? 'Product updated successfully.' : 'Product created successfully.');
    this.router.navigate(['/']);
  }
  
}
