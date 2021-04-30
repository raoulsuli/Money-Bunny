import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../services/authentication.service';
import { MoneyBunnyUser } from './../models/money-bunny-user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  newUser: MoneyBunnyUser = new MoneyBunnyUser(
		'', // name
		'', // username
		'', // password
		'', // email
		'',
		'', // phone
		new Date(),
		'', // address
		'', // userType
		undefined
  );
  passCheck: string = '';
 
  constructor(private authenticationService:AuthenticationService) { }

  signUp() {
    this.authenticationService.SignUp(this.newUser.email, this.newUser.password);
  }
  
  signIn() {
    this.authenticationService.SignIn(this.newUser.email, this.newUser.password);
  }
  
  signOut() {
    this.authenticationService.SignOut();
  }

  ngOnInit(): void {
  }

  setUserType(event: Event) {
    this.newUser.userType = (<HTMLInputElement>event.target).value;
  }
}
