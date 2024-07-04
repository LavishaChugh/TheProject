import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const backpageGuard: CanActivateFn = (route, state) => {

  const router=inject(Router);
 
  let isLoggedIn=sessionStorage.getItem("isloggIn");
 
  if(!sessionStorage.getItem("isloggIn"))
  {
    sessionStorage.setItem("isloggIn","false");
  }
   
  if(isLoggedIn=='true')
 
    {
      router.navigate(['/userDetails']);
      return false;
    }
return true;

};
