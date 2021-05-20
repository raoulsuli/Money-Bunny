import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../services/authentication.service';
import { MoneyBunnyUser } from './../models/money-bunny-user.model';
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

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
		'', // cnp
		'', // phone
		new Date(), // birthday
		'', // address
		'', // userType
		'' // company name: firestore doesn't recognise undefined
  );
  passCheck: string = '';
  invalidUser: string = '';
  signUpMessage: boolean = false;
  invalidEmail: string = '';
 
  constructor(private authenticationService:AuthenticationService, private firestore: AngularFirestore, private router: Router, private angularFireAuth: AngularFireAuth) { }

  signUp() {
    if (this.passCheck === this.newUser.password) {

      const existentUser = this.firestore.collection('users').doc(this.newUser.username);

      existentUser.get().toPromise().then((doc) => {
        if (!(doc.exists)) {
            this.angularFireAuth.createUserWithEmailAndPassword(this.newUser.email, this.newUser.password).then(() => {
              this.firestore.collection('users').doc(this.newUser.username).set({
                name: this.newUser.name,
                username: this.newUser.username,
                password: this.newUser.password,
                email: this.newUser.email,
                cnp: this.newUser.cnp,
                phone: this.newUser.phone,
                birthday: this.newUser.birthday,
                address: this.newUser.address,
                userType: this.newUser.userType,
                companyName: this.newUser.companyName
              });
  
              this.router.navigateByUrl('login');
            }).catch (error => {
              this.invalidEmail = this.newUser.email;
            });
        } else {
          this.invalidUser = this.newUser.username;
        }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });
    }
  }

  emailInUse() {
    return this.invalidEmail == this.newUser.email;
  }

  usernameInUse() {
    return this.invalidUser == this.newUser.username;
  }

  setUserType(event: Event) {
    this.newUser.userType = (<HTMLInputElement>event.target).value;
  }

  ngOnInit(): void {
  }
}
