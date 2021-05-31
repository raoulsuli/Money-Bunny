import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  public account: any;
  public currentAccountName = this.auth.getCurrentAccount();
  public currentAccount = this.auth.getCurrentIBAN();
  public frequent_accounts: any = [] as any;
  public all_accounts: any = [] as any;
  public transaction: Transaction = new Transaction('', 0, new Date(), '', this.firestore.collection('accounts').doc(this.currentAccount).ref, 0);
  private updated = false;
  private subscription: Subscription;

  constructor(private auth: AuthenticationService, private firestore: AngularFirestore, private router: Router, private http: HttpClient) {
    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        this.all_accounts[element['IBAN']] = [];
        this.all_accounts[element['IBAN']]['account_name'] = element['account_name'];
        element['bank_id'].get().then((result: any) => this.all_accounts[element['IBAN']]['bank_name'] = result.data()['name']);
        if (element['IBAN'] == this.currentAccount) {
          this.account = element;
          this.transaction['currency'] = element['currency'];
        }
      });
    });

    this.subscription = this.firestore.collection('frequent_accounts').valueChanges().subscribe((data: any) => {
      data.forEach((acc: any) => {
        acc['account_id'].get().then((result: any) => {
          if (result.data()['IBAN'] == this.currentAccount) this.frequent_accounts.push(acc);
        });
      });
      this.unsubscribe();
    });
    if (sessionStorage.getItem('convertedAmount') != undefined) {
      this.transaction['amount'] = Number(sessionStorage.getItem('convertedAmount'));
      sessionStorage.removeItem('convertedAmount');
    }
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  completeTransaction() {
    const doc = this.firestore.collection('transactions').doc();
    var id = doc.ref.id;
    doc.set({
      IBAN_dest: this.transaction['IBAN_dest'],
      amount: this.transaction['amount'],
      date: this.transaction['date'],
      currency: this.transaction['currency'],
      IBAN_src: this.transaction['IBAN_src'],
      recurrent_days: this.transaction['recurrent_days'],
      count: 1,
      id: id
    });
    
    this.firestore.collection('accounts').doc(this.currentAccount).update({
      balance: this.account['balance'] - this.transaction.amount
    });

    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        if (element['IBAN'] == this.transaction.IBAN_dest) {
          if (!this.updated) {
            this.updated = true;
            var conv_string =  this.transaction['currency'] + "_" + element['currency'];
            var api_string = 'https://free.currencyconverterapi.com/api/v5/convert?q=' + conv_string + '&compact=y&apiKey=7272e746547b8c161143';
            this.http.get(api_string).subscribe((res: any) => {
              this.firestore.collection('accounts').doc(this.transaction.IBAN_dest).update({
                balance: element['balance'] + res[conv_string]['val'] * this.transaction['amount']
              });
            });
          }
        }
      });
    });

    var docRef: string | undefined = this.currentAccountName;
    docRef += this.all_accounts[this.transaction['IBAN_dest']]['account_name'] === undefined ? this.transaction['IBAN_dest'] : this.all_accounts[this.transaction['IBAN_dest']]['account_name'];
    const freqAcc = this.firestore.collection('frequent_accounts').doc(docRef);
    const bankName = this.all_accounts[this.transaction['IBAN_dest']]['account_name'] === undefined ? this.transaction['IBAN_dest'].slice(4, 7) : this.all_accounts[this.transaction['IBAN_dest']]['bank_name'];

    freqAcc.get().toPromise().then((doc) => {
      if (!(doc.exists)) {
        this.firestore.collection('frequent_accounts').doc(docRef).set({
          IBAN: this.transaction['IBAN_dest'],
          bank_name: bankName,
          account_id: this.firestore.collection('accounts').doc(this.currentAccount).ref
        });
      }
    });
    alert('Success');
    this.router.navigateByUrl('account-dashboard');
  }

}
