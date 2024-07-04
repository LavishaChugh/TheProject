import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { UserService } from '../user.service';
import { routes } from '../app.routes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, MatFormFieldModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: any;
  // errorMessage: string = '';

  constructor(private fb: FormBuilder, private router : Router, private user: UserService) { }

  ngOnInit() {
    this.validateForm();
  }

  validateForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  isFormValid(): boolean {
    return this.loginForm.valid;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.user.login(email, password).subscribe(
        (response) => {

          if (response.token) {
            localStorage.setItem('token', response.token);
          

          if (this.user.isAdminLoggedIn()) {
            console.log("The admin has logged in");
            sessionStorage.setItem("isloggIn","true");  //---------------
            this.router.navigate(['/userDetails']);
          } 
          else {
            alert('Only admins can login.');
            sessionStorage.setItem("isloggIn","false");  //----------------
            this.loginForm.reset();
          }
        }
        else {
          alert('Invalid email or password.');
          sessionStorage.setItem("isloggIn", "false");
          this.loginForm.reset();
        }

        },
        (error) => {
          alert( 'Invalid email or password.');
          // console.log(error);
          sessionStorage.setItem("isloggIn","false");  //---------------
          // this.loginForm.reset();          
        }
      );
    }
  }


}
