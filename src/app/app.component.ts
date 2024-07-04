import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { RegistrationComponent } from "./registration/registration.component";
import { UserDetailsComponent } from "./user-details/user-details.component";



@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, RouterModule, LoginComponent, HomeComponent, RegistrationComponent, UserDetailsComponent,HomeComponent,RegistrationComponent,LoginComponent,UserDetailsComponent]
})
export class AppComponent {
  title = 'TheProject';
}

