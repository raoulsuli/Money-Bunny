import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class NotOperatorGuardService implements CanActivate{

  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate(): boolean {
    if (this.auth.getUserType() == 'operator') {
      this.router.navigateByUrl('operator-menu');
      return false;
    }
    return true;
  }
}
