import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../services/authentication.service';
import { MoneyBunnyUser } from './../models/money-bunny-user.model';
import { AngularFirestore } from "@angular/fire/firestore";

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
 
  constructor(private authenticationService:AuthenticationService, private firestore: AngularFirestore) { }

  signUp() {
    if (this.passCheck === this.newUser.password) {

      const existentUser = this.firestore.collection('users').doc(this.newUser.username);

      existentUser.get().toPromise().then((doc) => {
        if (!(doc.exists)) {
          console.log("Not found");
          console.log(this.newUser.username);

          this.authenticationService.SignUp(this.newUser.email, this.newUser.password);
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
          })
          .then(res => {
              console.log(res);
          })
          .catch(e => {
              console.log(e);
          })
        } else {
          this.invalidUser = this.newUser.username;
        }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });
    }
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
