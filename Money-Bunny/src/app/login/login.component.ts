import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../services/authentication.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  user: any;

  constructor(private authenticationService: AuthenticationService, private auth: AngularFireAuth,
    private firestore: AngularFirestore, private router: Router) { }

  ngOnInit(): void { }
 
  signIn() {
    this.authenticationService.SignIn(this.email, this.password);

    console.log(this.authenticationService.getCurrentUser());
    this.firestore.collection('users').doc(this.authenticationService.getCurrentUser()).get().toPromise().then((doc) => {
      if (doc.exists) {
        this.user = doc.data();
        console.log(this.user.userType);

        if (this.user.userType === 'operator') {
          this.router.navigateByUrl('operator-menu');
        }
      } else {
          console.log("No such document!");
          return;
      }
    }).catch((error: any) => {
        console.log("Error getting document:", error);
        return;
    });
  }
  
}
