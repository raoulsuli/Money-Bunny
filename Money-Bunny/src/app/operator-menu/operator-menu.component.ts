import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { BankAccount } from './../models/bank-account.model';

@Component({
  selector: 'app-operator-menu',
  templateUrl: './operator-menu.component.html',
  styleUrls: ['./operator-menu.component.css']
})
export class OperatorMenuComponent implements OnInit {

  user: any;
  public requests = [] as any;
  public requestData = new Map();
  private subscription: Subscription;
  addAccount: boolean = false;
  validateAccount: boolean = false;
  newAccount: BankAccount = new BankAccount(
		'', // iban
		'', // pin
		0, // sold
		'', // accountType
		new Date(), // dateOpened
		false, // blocked
		'', // coin
  );
  clientUsername: any;
  
  constructor(private firestore: AngularFirestore, public auth: AuthenticationService, private router: Router) {
    this.firestore.collection('users').doc(this.auth.getCurrentUser()).get().toPromise().then((doc) => {
      if (doc.exists) {
        this.user = doc.data();
      } else {
          console.log("No such document!");
          return;
      }
    }).catch((error: any) => {
        console.log("Error getting document:", error);
        return;
    });

    this.subscription = this.firestore.collection('requests').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {

        element['bank'].get().then((req: any) => {
          this.user.bank.get().then((op: any) => {
            if (req.id == op.id) {
              this.requests.push(element);
            }
          });
        });
      });
      this.unsubscribe();
    });
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }

  acceptRequest(request: any) {
    if (request['requestType'] === 'open') {
      this.addAccount = true;
      this.newAccount.accountType = request['type'];
      this.newAccount.coin = request['coin'];
    }
    else if (request['requestType'] === 'close') {
      this.firestore.collection('accounts').doc(request['iban']).delete().then(() => {
        console.log("Document successfully deleted!");

        this.firestore.collection('requests').doc(request['requestID']).delete().then(() => {
          console.log("Document successfully deleted!");
          this.refresh();
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
    }
    else if (request['requestType'] === 'validate') {
      this.validateAccount = true;
    }
  }

  ngOnInit(): void {
  }

  createAccount(request: any) {
    this.firestore.collection('users', ref => ref.where("email", "==", request['email'])).get()
      .toPromise().then((result: any) => {
        result.forEach((element: any) => {
            if (element.data() != undefined) {
              this.clientUsername = element.data().username;

              this.firestore.collection('accounts').doc(this.newAccount.iban).set({
                IBAN: this.newAccount.iban,
                PIN: this.newAccount.pin,
                account_name: this.newAccount.iban,
                account_type: this.newAccount.accountType,
                balance: this.newAccount.sold,
                bank_id: this.user.bank,
                open_date: new Date(),
                blocked: false,
                closing: false,
                currency: this.newAccount.coin,
                user_id: this.firestore.doc('accounts/' + this.clientUsername).ref
              });

              this.firestore.collection('requests').doc(request['requestID']).delete().then(() => {
                console.log("Document successfully deleted!");
              }).catch((error) => {
                  console.error("Error removing document: ", error);
              });

              this.refresh();
            }
        });
      });
  }

  refresh(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigateByUrl('operator-menu'));
  }
}
