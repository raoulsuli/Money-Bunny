import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class OperatorGuardService implements CanActivate{

  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate(): boolean {
    if (this.auth.getUserType() != 'operator') {
      this.router.navigateByUrl('logged-in-menu');
      return false;
    }
    return true;
  }
}
