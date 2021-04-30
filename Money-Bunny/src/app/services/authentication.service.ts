import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: Observable<firebase.User | null>;

  constructor(private angularFireAuth: AngularFireAuth) {
    this.userData = angularFireAuth.authState;
  }
  
  /* Sign up */
  SignUp(email: string, password: string) {
    this.angularFireAuth.createUserWithEmailAndPassword(email, password)
    .then(res => {
      console.log('You are Successfully signed up!', res);
    })
    .catch(error => {
      console.log('Something is wrong:', error.message);
    });
  }
   
  /* Sign in */
  SignIn(email: string, password: string) {
    this.angularFireAuth.signInWithEmailAndPassword(email, password)
    .then(res => {
      console.log('You are Successfully logged in!', res);
    })
    .catch(err => {
      console.log('Something is wrong:',err.message);
    });
  }
   
  /* Sign out */
  SignOut() {
    this.angularFireAuth.signOut();
  }
}
