import { Component, Directive, Input, OnInit, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../../Models/User.Model';
import { HttpClient, HttpClientModule, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { RemoveUnderscoreDirective } from '../remove-underscore.directive';
import { UserService } from '../user.service';


@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, MatFormFieldModule, RouterModule, AsyncPipe, NgxDatatableModule, NgxPaginationModule, RemoveUnderscoreDirective],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  p = 1;
  pageSizeOptions: number[] = [5, 10, 15];
  totalPages: number = 0;
  pageSize: number ;
  currentPage: number = 0;
  // pageNumber : number = 0;

  rows: User[] = [];
  columns = [
    { prop: 'type' , width : 150},
    { prop: 'name', width : 210 },
    { prop: 'email' , width : 270},
    { prop: 'address', width : 200 },
    { prop: 'phone' ,width : 200},
    { prop: 'dob',  }
  ];

  constructor(private http: HttpClient, private router: Router, public userService: UserService) { 
    this.pageSize = this.pageSizeOptions[1]
  }

  ngOnInit(): void {
    this.getUsers();
  }


  getUsers() {

    if (!this.userService.isAdminLoggedIn()) {
      console.log("User is not logged in");
      return;
    }
    else{

      
    const token = this.userService.getToken();
    console.log('Stored token:', token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`https://localhost:7050/api/User?pageSize=${this.pageSize}&pageIndex=${this.currentPage}`, { headers})
      .subscribe(
        (response) => {
          this.rows = response.items;
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage - 1;
        },
        (error) => {
          console.error('Error fetching users', error);
          // Handle error appropriately (e.g., show error message)
        }
      );
    }
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber - 1;
    this.getUsers();
  }


  onPageSizeChange() {
    this.currentPage = 0; // Reset to first page when page size changes
    this.getUsers();
  }

  getPaginationRange(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }



  logout() {
    sessionStorage.setItem("isloggIn", "false");

    this.router.navigate(['/login']);

  }

  onActivate(event: any) {
    if (event.type == 'click') {
      console.log('click');
      console.log(event.row);
      this.userService.selectUser(event.row);

      this.router.navigate(['/details', event.row.id])

    }
  }

}
