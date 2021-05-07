import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: Observable<firebase.User | null>;
  public loggedIn = false;

  constructor(private router: Router, private angularFireAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.userData = angularFireAuth.authState;
    this.loggedIn = !!sessionStorage.getItem('user');
  }
  
  /* Sign up */
  SignUp(email: string, password: string) {
    this.angularFireAuth.createUserWithEmailAndPassword(email, password)
    .then(res => {
      console.log('You are Successfully signed up!', res);
      return 'Account created!';
    })
    .catch(error => {
      console.log('Something is wrong:', error.message);
      if(error.code === 'auth/email-already-in-use')
        return 'Email adress already in use!';
      return 'An error occured! Try again later!';
    });
    return 'An error occured! Try again later!';
  }
   
  /* Sign in */
  SignIn(email: string, password: string) {
    this.angularFireAuth.signInWithEmailAndPassword(email, password)
    .then((res) => {
      this.router.navigateByUrl('logged-in-menu');
      this.firestore.collection('users').valueChanges().subscribe((data) => {
        data.forEach((item: any) => {
          if (item['email'] == email) sessionStorage.setItem('user', item['username']);
        })
      });
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
