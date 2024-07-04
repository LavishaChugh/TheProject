import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { loginGuard } from './login.guard';
import { backpageGuard } from './backpage.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {path : 'home', component: HomeComponent , canActivate : [loginGuard] },
    {path : 'registration' , component : RegistrationComponent, canActivate : [loginGuard]},
    {path : 'login' , component : LoginComponent, canActivate : [backpageGuard]},
    {path : 'userDetails', component : UserDetailsComponent, canActivate : [loginGuard]},
    {path : 'details/:id' , component: DetailViewComponent , canActivate: [loginGuard] }
];
