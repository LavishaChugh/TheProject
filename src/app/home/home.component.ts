import { Component, OnInit, inject } from '@angular/core';
import { CanActivateFn, Router, RouterModule } from '@angular/router';
import { register } from 'module';
import { RegistrationComponent } from "../registration/registration.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [RouterModule, RegistrationComponent]
})
export class HomeComponent{

    
}
