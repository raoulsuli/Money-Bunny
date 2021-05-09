import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AccountGuardService implements CanActivate{

  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate(): boolean {
    if (!this.auth.isAccountSet()) {
      this.router.navigateByUrl('logged-in-menu');
      return false;
    }
    return true;
  }
}
