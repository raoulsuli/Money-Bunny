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

  user: any;
  account: any;
  bank: string = 'none';

  constructor(public auth: AuthenticationService, private firestore: AngularFirestore, private router: Router) {
  }

  ngOnInit(): void {
    this.firestore.collection('users').doc(this.auth.getCurrentUser()).get().toPromise().then((doc) => {
      if (doc.exists) {
        this.user = doc.data();

          if (this.user.userType === 'pfizica') {
            this.account = new OpenPF(
              '', // type
              '', // coin
              '', // name
              '', // surname
              'Romanian', // nationality
              this.user.cnp, // cnp
              '', // idSeries
              '', // idNumber
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
              '', // organizationType
              '', // representativeName
              '', // representativeSurname
              this.user.cnp, // cnp
              '', // idSeries
              '', // idNumber
              '', // cui
              '', // certificateNumber
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

  onSelectBank(bankCode: string) {
    if (this.account) {
      this.bank = bankCode;
      this.account.bank = bankCode;
    }
  }

  setAccount(event: Event) {
    this.account.type = (<HTMLInputElement>event.target).value;
  }

  setCurrency(event: Event) {
    this.account.coin = (<HTMLInputElement>event.target).value;
  }

  setBank(event: Event) {
    this.account.bank = (<HTMLInputElement>event.target).value;
    console.log(this.account.bank);
  }

  submit() {
    if (this.user.userType === 'pfizica') {
      this.firestore.collection('requests').add({
        requestType: "open",
        type: this.account.type,
		    coin: this.account.coin,
		    name: this.account.name,
		    surname: this.account.surname,
		    nationality: this.account.nationality,
		    cnp: this.account.cnp,
		    idSeries: this.account.idSeries,
		    idNumber: this.account.idNumber,
		    birthday: this.account.birthday,
		    email: this.account.email,
		    phone: this.account.phone,
		    address: this.account.address,
		    bank: this.firestore.doc('banks/' + this.account.bank).ref
      })
      .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
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
		    organizationType: this.account.organizationType,
		    representativeName: this.account.representativeName,
		    representativeSurname: this.account.representativeSurname,
		    cnp: this.account.cnp,
		    idSeries: this.account.idSeries,
		    idNumber: this.account.idNumber,
		    cui: this.account.cui,
		    registerDate: this.account.registerDate,
		    nationality: this.account.nationality,
		    certificateNumber: this.account.certificateNumber,
		    phone: this.account.phone,
		    email: this.account.email,
		    address: this.account.address,
		    bank: this.firestore.doc('banks/' + this.account.bank).ref
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
