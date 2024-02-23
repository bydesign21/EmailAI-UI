import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChildFn } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.checkSession().pipe(
      tap(isAuthenticated => {
        console.log('isAuthenticated', isAuthenticated);
        if (!isAuthenticated) {
          this.router.navigate(['/auth/login']); // Redirect to login or another route
        }
      }));
  }
}
