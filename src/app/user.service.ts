import { Injectable } from '@angular/core';
import { User } from '../Models/User.Model';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from "jwt-decode";
import { error } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  decode: any;

  private selectedUserSubject = new BehaviorSubject<User | null>(null);
  selectedUser$ = this.selectedUserSubject.asObservable();
  private isLoggedIn: boolean = false;
  private isAdmin: boolean = false;

  constructor(public http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      console.log("No Token");
      return new HttpHeaders();
    }
  }

  selectUser(user: User): void {
    this.selectedUserSubject.next(user);
  }

  deleteItem(email: string): Observable<any> {
    const url = `${`https://localhost:7050/api/User`}?email=${email}`;
    return this.http.delete(url, {headers: this.getHeaders()}).pipe(
      catchError(error => {

        console.log("No Token!")
        throw error
  })
    );
  }

  login(email: string, password: string): Observable<any> {

    return this.http.post<any>('https://localhost:7050/api/User/login', { email, password }).pipe(
      map(response => {

        if (response.token) {
          localStorage.setItem('token', response.token);
          this.decode = this.decodeToken(response.token);
          console.log(this.decode);
          this.isLoggedIn = true;
          this.isAdmin = this.decode.role === 'Admin';
        }
        return response;
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.isAdmin = false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }


  isAdminLoggedIn(): boolean {
    return this.isLoggedIn && this.isAdmin;
  }

  public decodeToken(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPlayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''));

    return JSON.parse(jsonPlayload);
  }

  updateUser(updatedUser: User): Observable<any> {
    const url = `${'https://localhost:7050/api/User/'}?id=${updatedUser.id}`;
    return this.http.put(url, updatedUser, {headers : this.getHeaders()}).pipe(
      catchError(error => {
        console.log("No Token");
        throw error;
      })
    );
  }


  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`https://localhost:7050/api/User/?email=${email}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Failed to check email existence:', error);
        throw error; 
      })
    );
  }
}


