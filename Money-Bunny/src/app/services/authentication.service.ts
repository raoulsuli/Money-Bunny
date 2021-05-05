import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: Observable<firebase.User | null>;
  public loggedIn = false;

  constructor(private router: Router, private angularFireAuth: AngularFireAuth) {
    this.userData = angularFireAuth.authState;
    this.loggedIn = !!sessionStorage.getItem('user');
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
    .then(() => {
      this.router.navigateByUrl('logged-in-menu');
      sessionStorage.setItem('user', email);
      this.loggedIn = true;
    })
    .catch(err => {
      alert(err.message);
    });
  }
   
  /* Sign out */
  SignOut() {
    this.angularFireAuth.signOut();
    this.loggedIn = false;
    sessionStorage.removeItem('user');
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getCurrentUser() {
    return sessionStorage.getItem('user') || undefined;
  }
}
