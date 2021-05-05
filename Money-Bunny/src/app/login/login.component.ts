import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../services/authentication.service';
import { AngularFireAuth } from "@angular/fire/auth";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loggedIn: string = '';

  constructor(private authenticationService: AuthenticationService, private auth: AngularFireAuth) { }

  ngOnInit(): void { }
 
  signIn() {
    this.authenticationService.SignIn(this.email, this.password);
    this.email = '';
    this.password = '';
  }
  
}
