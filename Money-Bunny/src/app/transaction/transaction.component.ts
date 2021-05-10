import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Transaction } from '../models/transaction.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  public account: any;
  public currentAccount = this.auth.getCurrentAccount();
  public transaction: Transaction = new Transaction('', 0, new Date(), '', this.firestore.collection('accounts').doc(this.currentAccount), 0);
  private updated = false;

  constructor(private auth: AuthenticationService, private firestore: AngularFirestore, private router: Router) {
    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        if (element['account_name'] == this.currentAccount) {
          this.account = element;
          this.transaction['currency'] = element['currency'];
        }
      });
    });
  }

  ngOnInit(): void {
  }

  completeTransaction() {
    this.firestore.collection('transactions').doc().set({
      IBAN_dest: this.transaction['IBAN_dest'],
      amount: this.transaction['amount'],
      date: this.transaction['date'],
      currency: this.transaction['currency'],
      IBAN_src: this.transaction['IBAN_src'],
      recurrent_days: this.transaction['recurrent_days']
    });
    
    this.firestore.collection('accounts').doc(this.account['account_name']).update({
      balance: this.account['balance'] - this.transaction.amount
    });

    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        if (element['IBAN'] == this.transaction.IBAN_dest) {
          if (!this.updated) {
            this.updated = true;
            this.firestore.collection('accounts').doc(element['account_name']).update({
              balance: element['balance'] + this.transaction.amount
            });
          }
        }
      });
    });

    alert('Success');
    this.router.navigateByUrl('account-dashboard');
  }

}
