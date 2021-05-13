import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { convert } from 'exchange-rates-api';
import { Transaction } from '../models/transaction.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  public account: any;
  //public currentAccount = this.auth.getCurrentAccount();
  public currentAccount = this.auth.getCurrentIBAN();
  public frequent_accounts: any = [] as any;
  public all_accounts: any = [] as any;
  public transaction: Transaction = new Transaction('', 0, new Date(), '', this.firestore.collection('accounts').doc(this.currentAccount).ref, 0);
  private updated = false;

  constructor(private auth: AuthenticationService, private firestore: AngularFirestore, private router: Router) {
    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        this.all_accounts[element['IBAN']] = [];
        this.all_accounts[element['IBAN']]['account_name'] = element['account_name'];
        element['bank_id'].get().then((result: any) => this.all_accounts[element['IBAN']]['bank_name'] = result.data()['name']);
        //if (element['account_name'] == this.currentAccount) {
          if (element['IBAN'] == this.currentAccount) {
          this.account = element;
          this.transaction['currency'] = element['currency'];
        }
      });
    });

    this.firestore.collection('frequent_accounts').valueChanges().subscribe((data: any) => {
      this.frequent_accounts = data;
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
    
    //this.firestore.collection('accounts').doc(this.account['account_name']).update({
    this.firestore.collection('accounts').doc(this.account['IBAN']).update({
      balance: this.account['balance'] - this.transaction.amount
    });

    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        if (element['IBAN'] == this.transaction.IBAN_dest) {
          if (!this.updated) {
            this.updated = true;
            var date = new Date();
            var today = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + String(date.getDate()).padStart(2, '0');
            convert(this.transaction.amount, this.transaction.currency, element['currency'], today).then((res: any) => {
              //this.firestore.collection('accounts').doc(element['account_name']).update({
              this.firestore.collection('accounts').doc(this.account['IBAN']).update({
                balance: element['balance'] + res
              });
            });
          }
        }
      });
    });

    var docRef: string | undefined = this.currentAccount;
    docRef += this.all_accounts[this.transaction['IBAN_dest']]['account_name'] === undefined ? this.transaction['IBAN_dest'] : this.all_accounts[this.transaction['IBAN_dest']]['account_name'];
    const freqAcc = this.firestore.collection('frequent_accounts').doc(docRef);
    const bankName = this.all_accounts[this.transaction['IBAN_dest']]['account_name'] === undefined ? this.transaction['IBAN_dest'].slice(4, 7) : this.all_accounts[this.transaction['IBAN_dest']]['bank_name'];

    freqAcc.get().toPromise().then((doc) => {
      if (!(doc.exists)) {
        this.firestore.collection('frequent_accounts').doc(docRef).set({
          IBAN: this.transaction['IBAN_dest'],
          bank_name: bankName,
          user_id: this.firestore.collection('accounts').doc(this.currentAccount).ref
        });
      }
    });
    alert('Success');
    this.router.navigateByUrl('account-dashboard');
  }

}
