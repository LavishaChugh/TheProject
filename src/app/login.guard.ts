import { ɵnormalizeQueryParams } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  let isLoggedIn = sessionStorage.getItem("isloggIn");
  const router = inject(Router);
 
 
  if (!sessionStorage.getItem("isloggIn")) {
    sessionStorage.setItem("isloggIn", "false");
  }
 
  if (isLoggedIn == 'false') {
    // alert("Please login redirecting to login page !!");
    router.navigate(['login'] , {queryParams : {returnUrl : state.url}});
    return false;
  }
  return true;
};
