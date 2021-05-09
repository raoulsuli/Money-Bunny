import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class NotAccountGuardService implements CanActivate{

  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate(): boolean {
    if (this.auth.isAccountSet()) {
      this.router.navigateByUrl('account-dashboard');
      return false;
    }
    return true;
  }
}
