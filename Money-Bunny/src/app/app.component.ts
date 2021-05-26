import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  subscription: Subscription;

  constructor(public route: Router, public auth: AuthenticationService, private firestore: AngularFirestore) {
    this.subscription = this.firestore.collection('transactions').valueChanges().subscribe((transactions: any) => {
      transactions.forEach((transaction: any) => {
        if (transaction['recurrent_days'] != 0) {
          var trans_date = transaction['date'].toDate();
          var date = new Date();
          var new_date = new Date(trans_date.getFullYear(), trans_date.getMonth(), trans_date.getDate() + transaction['recurrent_days'] * transaction['count'], trans_date.getHours(), trans_date.getMinutes(), trans_date.getSeconds());
          var next_day_date = new Date(trans_date.getFullYear(), trans_date.getMonth(), trans_date.getDate() + transaction['recurrent_days'] * transaction['count'] + 1, trans_date.getHours(), trans_date.getMinutes(), trans_date.getSeconds());
          if (date >= new_date && date < next_day_date) {
            this.firestore.collection('accounts').doc(transaction['IBAN_dest']).get().toPromise().then((result: any) => {
              this.firestore.collection('accounts').doc(transaction['IBAN_dest']).update({
                balance: result.data()['balance'] + transaction['amount']
              });
            });
            transaction['IBAN_src'].get().then((acc: any) => {
              this.firestore.collection('accounts').doc(acc.data()['IBAN']).update({
                balance: acc.data()['balance'] - transaction['amount']
              });
            });
            
            this.firestore.collection('transactions').doc(transaction['id']).update({count: transaction['count'] + 1});
          }
        }
      });
      this.unsubscribe();
    });
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }
}