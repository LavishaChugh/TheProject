import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { User } from '../../Models/User.Model';
import { UserService } from '../user.service';
import { ok } from 'assert';
import { error } from 'console';
import { ActivatedRoute, Route } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,CommonModule,UserDetailsComponent],
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.css'
})
export class DetailViewComponent implements OnInit {
  selectedUser: User | null = null;
  editMode: boolean = false;
  originalUser: any; 
  imageUrl : string = "";


  constructor(private userService: UserService, private route : ActivatedRoute, private http: HttpClient) {
   }

  ngOnInit(): void {
    this.userService.selectedUser$.subscribe(
      user => {
        this.selectedUser = user;
        console.log('Selected user:', this.selectedUser);
        this.originalUser = { ...user };
        if (this.selectedUser?.image) {
          this.imageUrl = `https://localhost:7050/api/User/?image=${this.selectedUser.image}`;
        } else {
          this.imageUrl = ""; 
        }
      }
    );
  }

  onSave(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser as User).subscribe(() => {
        this.editMode = false;
      });
    }
  }
  
  cancelEdit(): void {
    this.selectedUser = { ...this.originalUser };
    this.editMode = false;
  }


  delete(email : any){

    this.userService.deleteItem(email).subscribe(response => {
      console.log(response); 
      alert("Deleted Successfully!");
    },
  error => {
    console.error(error);
    alert("Deletion failed. Please try again.");
    
  });

  }

}

