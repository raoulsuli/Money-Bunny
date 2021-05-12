import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void { }
 
  signIn() {
    this.authenticationService.SignIn(this.email, this.password);
  }
  
}
