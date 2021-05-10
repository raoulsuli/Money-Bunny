import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-transactions-report',
  templateUrl: './transactions-report.component.html',
  styleUrls: ['./transactions-report.component.css']
})
export class TransactionsReportComponent implements OnInit {
  public transactions: any = [] as any;
  public currentAccount = this.auth.getCurrentUser();
  public all_accounts: any = [] as any;

  constructor(private firestore: AngularFirestore, private auth: AuthenticationService) {
    if (this.transactions.length != 0) return;

    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => this.all_accounts = data);
    
    this.firestore.collection('transactions').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        element['IBAN_src'].get().then((result: any) => {
          result.data()['user_id'].get().then((res: any) => {
            if (res.data()['username'] == this.currentAccount) {
              this.transactions.push(element);
            }
          })
        });
        this.all_accounts.forEach((acc: any) => {
          if (acc['IBAN'] == element['IBAN_dest']) {
            this.transactions.push(element);
          }
        })
      });
    });
  }

  ngOnInit(): void {
  }

}
