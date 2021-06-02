import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MoneyBunnyUser } from '../models/money-bunny-user.model';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {
  newUser!: MoneyBunnyUser;
  passCheck: string = '';
  invalidUser: string = '';
  currentName: string = "";
  accounts = [] as any;

  constructor(private authenticationService: AuthenticationService, private firestore: AngularFirestore, private router: Router, private angularFireAuth: AngularFireAuth) {
    this.firestore.collection('users').doc(this.authenticationService.getCurrentUser()).get().subscribe((res: any) => {
      this.newUser = new MoneyBunnyUser(res.data()['name'], res.data()['username'], res.data()['password'], res.data()['email'],
      res.data()['cnp'], res.data()['phone'], res.data()['birthday'], res.data()['address'], res.data()['userType'], res.data()['companyName']);
      this.currentName = res.data()['username'];
      this.passCheck = res.data()['password'];
    });

    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        element['user_id'].get().then((result: any) => {
          if (result.data() != undefined && result.data()['username'] == authenticationService.getCurrentUser()) {
            this.accounts.push(element);
          }
        });
      });
    });
  }

  ngOnInit(): void {
  }

  update() {
    if (this.passCheck === this.newUser.password) {
      if (this.newUser.email !== this.authenticationService.getCurrentEmail()) {
        this.angularFireAuth.currentUser.then((user) => {
          if (user) {
            this.angularFireAuth.signInWithEmailAndPassword(
              this.authenticationService.getCurrentEmail()!, this.authenticationService.getCurrentPassword()!).then(() => {

                user.updateEmail(this.newUser.email).then(() => {
                  sessionStorage.setItem('email', this.newUser.email);
                  this.angularFireAuth.signInWithEmailAndPassword(this.newUser.email, this.authenticationService.getCurrentPassword()!)
                }).catch(err => console.log(err));
              });
          }
        });
      }
      if (this.newUser.password !== this.authenticationService.getCurrentPassword()) {
        this.angularFireAuth.currentUser.then((user) => {
          if (user) {
            this.angularFireAuth.signInWithEmailAndPassword(
              this.authenticationService.getCurrentEmail()!, this.authenticationService.getCurrentPassword()!).then(() => {

              user.updatePassword(this.newUser.password).then(() => {
                sessionStorage.setItem('password', this.newUser.password);
                this.angularFireAuth.signInWithEmailAndPassword(this.authenticationService.getCurrentEmail()!, this.newUser.password)
              }).catch(err => console.log(err));
            });
          }
        });
      }
      if (this.newUser.username === this.authenticationService.getCurrentUser()) {
        this.firestore.collection('users').doc(this.newUser.username).update({
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
        }).then(() => {
          alert("Success");
        });
        this.router.navigateByUrl('logged-in-menu');
      } else {
        this.firestore.collection('users').doc(this.newUser.username).get().toPromise().then((doc) => {
          if (!(doc.exists)) {
            this.firestore.collection('users').doc(this.authenticationService.getCurrentUser()).delete().then(() => {
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
              }).then(() => {
                this.accounts.forEach((acc: any) => {
                  this.firestore.collection('accounts').doc(acc['IBAN']).update({user_id: this.firestore.collection('users').doc(this.newUser.username).ref});
                });
                sessionStorage.setItem('user', this.newUser.username);
                console.log("New username: ",this.authenticationService.getCurrentUser());
                
                alert("Success");
                this.router.navigateByUrl('logged-in-menu');
              });
            });
            
          } else {
            this.invalidUser = this.newUser.username;
          }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
      }
    }
  }

  usernameInUse() {
    return this.invalidUser == this.newUser.username;
  }

  setUserType(event: Event) {
    this.newUser.userType = (<HTMLInputElement>event.target).value;
  }

}
