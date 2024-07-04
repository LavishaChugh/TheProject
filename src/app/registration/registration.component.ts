import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select'
import { RemoveUnderscoreDirective } from '../remove-underscore.directive';
import { UserService } from '../user.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, MatFormFieldModule, RouterModule,HttpClientModule,AsyncPipe,RemoveUnderscoreDirective, MatDatepickerModule,MatNativeDateModule,MatInputModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
  selectedFile: File | null = null;
  registrationForm: FormGroup | any;
  http = inject(HttpClient);

  constructor(private formbuilder: FormBuilder, private service: UserService) {}

  ngOnInit() {
    this.validateForm();
  }

  //The Validatorss
  validateForm() {
    this.registrationForm = this.formbuilder.group({
      type: ['', [Validators.required, this.correctType.bind(this) ]],
      name: ['', [Validators.required ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8),this.validatePassword]],
      dob: ['', [Validators.required, this.validateDOB ]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      image: ['',Validators.required] 
    })
  }

  correctType(control: AbstractControl): { [key: string]: any } | null {
    const type = control.value;
    if (type !== 'admin' && type !== 'user') {
      return { 'incorrectType': true };
    }
    return null;
  }

  validatePassword(control: AbstractControl): { [key: string]: any } | null {
    const password = control.value;
    if (password) {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const valid = hasUpperCase && hasLowerCase && hasNumber;
      if (!valid) {
        return { 'invalidPassword': true };
      }
    }
    return null;
  }

  validateDOB(control: AbstractControl): { [key: string]: any } | null {
    const dob = control.value;
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        return { 'invalidDOB': true };
      }
    }
    return null;
  }


  checkEmail(email : any){

    this.service.checkEmailExists(email).subscribe(response => {
      console.log(response); 
    })

  }


  isFormValid(): boolean {
    return this.registrationForm.valid;
  }

  reset() {
    this.registrationForm.reset();
  }

  AddUser() {
    if (!this.registrationForm.valid || !this.selectedFile) {
      console.log('Form is invalid or file not selected');
      return;
    }
  
    const formData = new FormData();
    formData.append('type', this.registrationForm.value.type);
    formData.append('name', this.registrationForm.value.name);
    formData.append('email', this.registrationForm.value.email);
    formData.append('password', this.registrationForm.value.password);
    formData.append('dob', this.registrationForm.value.dob);
    formData.append('address', this.registrationForm.value.address);
    formData.append('phone', this.registrationForm.value.phone);
    formData.append('image', this.selectedFile);

    const headers = new HttpHeaders();
  headers.append('Content-Type', 'multipart/form-data');
  
    this.http.post<Form>('https://localhost:7050/api/User', formData, {
      headers : headers
    }).subscribe({
      next: (value) => {
        console.log(value);
        alert('Registered Successfully');
        this.registrationForm.reset();
      },
      error: (error) => {
        console.log('Error occurred');
        alert('Email Already Exists!');
        alert('Registration failed. Please try again.');
      }
    });
  }

  onFileSelected(event: any): void {
    console.log(event);
    this.selectedFile = event.target.files[0] as File;
  }


}
