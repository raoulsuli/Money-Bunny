import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { OpenPF } from './../models/open-pf.model';
import { OpenPJ } from './../models/open-pj.model';
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: 'app-bank-select',
  templateUrl: './bank-select.component.html',
  styleUrls: ['./bank-select.component.css']
})
export class BankSelectComponent implements OnInit {

  public user: any;
  public account: any;
  public banks = [] as any;
  public account_name: string = '';

  constructor(public auth: AuthenticationService, private firestore: AngularFirestore, private router: Router) {
    this.firestore.collection('banks').valueChanges().subscribe((banks: any) => this.banks = banks);
  }

  ngOnInit(): void {
    this.firestore.collection('users').doc(this.auth.getCurrentUser()).get().toPromise().then((doc) => {
      if (doc.exists) {
        this.user = doc.data();

          if (this.user.userType === 'pfizica') {
            this.account = new OpenPF(
              '', // type
              '', // coin
              this.user.name, // name
              'Romanian', // nationality
              this.user.cnp, // cnp
              this.user.birthday, // birthday
              this.user.phone, // phone
              this.user.email, // email
              this.user.address, // address
              '' // bank
            );
          }
          else /*if (this.user.userType === 'pjuridica')*/{
            this.account = new OpenPJ(
              '', // type
              '', // coin
              this.user.companyName, // name
              this.user.cnp, // cnp
              'Romanian', // nationality
              new Date(), // registerDate
              this.user.phone, // phone
              this.user.email, // email
              this.user.address, // address
              '' // bank
            );
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

  submit() {
    if (this.user.userType === 'pfizica') {
      this.firestore.collection('requests').add({
        requestType: "open",
        timestamp: new Date(),
        type: this.account.type,
		    coin: this.account.coin,
		    name: this.account.name,
        account_name: this.account_name,
		    nationality: this.account.nationality,
		    cnp: this.account.cnp,
		    birthday: this.account.birthday,
		    email: this.account.email,
		    phone: this.account.phone,
		    address: this.account.address,
		    bank: this.firestore.doc('banks/' + this.account.bank).ref,
        fromUserType: this.user.userType
      })
      .then((docRef) => {
          alert("Request sent!");
          this.router.navigateByUrl('logged-in-menu');
          this.firestore.collection('requests').doc(docRef.id).update({ requestID: docRef.id });
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
    }
    else {
      this.firestore.collection('requests').add({
        requestType: "open",
        type: this.account.type,
		    coin: this.account.coin,
		    name: this.account.name,
        account_name: this.account_name,
		    cnp: this.account.cnp,
		    nationality: this.account.nationality,
		    phone: this.account.phone,
		    email: this.account.email,
		    address: this.account.address,
		    bank: this.firestore.doc('banks/' + this.account.bank).ref,
        fromUserType: this.user.userType
      })
      .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          alert("Request sent!");
          this.router.navigateByUrl('logged-in-menu');
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
    }
  }
}
