import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AccountDashboardComponent } from '../account-dashboard/account-dashboard.component';
import { Transaction } from '../models/transaction.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  public account: any;
  public transaction: Transaction;

  constructor(private auth: AuthenticationService, private firestore: AngularFirestore) {
    var currentAccount = auth.getCurrentAccount();
  
    firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        if (element['account_name'] == currentAccount) {
          this.account = element;
          this.transaction.IBAN_src = element;
          return;
        }
      });
    });

    this.transaction = new Transaction(
      '', // IBAN_dest
      0, // sum
      new Date(), // date
      '', // currency
      this.account, // IBAN_src
      0 // recurrent_days
    );
    console.log(this.transaction);
  }

  ngOnInit(): void {
  }

}
