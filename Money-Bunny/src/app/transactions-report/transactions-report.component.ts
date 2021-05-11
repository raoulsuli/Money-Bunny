import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { AuthenticationService } from '../services/authentication.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-transactions-report',
  templateUrl: './transactions-report.component.html',
  styleUrls: ['./transactions-report.component.css']
})
export class TransactionsReportComponent implements OnInit {
  public transactions: any = [] as any;
  public currentUser = this.auth.getCurrentUser();
  public currentAccount: any;
  public all_accounts: any = [] as any;
  public subscription: Subscription;

  constructor(private firestore: AngularFirestore, private auth: AuthenticationService) {
    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      this.all_accounts = data;
      data.forEach((res: any) => {
        if (res['account_name'] == this.auth.getCurrentAccount()) {
          this.currentAccount = res;
        }
      })
    });

    this.subscription = this.firestore.collection('transactions').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        element['IBAN_src'].get().then((result: any) => {
          result.data()['user_id'].get().then((res: any) => {
            if (res.data()['username'] == this.currentUser || element['IBAN_dest'] == this.currentAccount['IBAN']) {
              element['IBAN_src'].get().then((acc: any) => {
                element['account_iban'] = acc.data()['IBAN'];
              });
              this.transactions.push(element);
              this.transactions.sort((t1: Transaction, t2: Transaction) => (t1['date'] < t2['date'] ? 1 : -1));
            }
          })
        });
      });
      this.unsubscribe();
    });
  }

  ngOnInit(): void {
    
  }

  downloadPDF() {
    const doc = new jsPDF();
    autoTable(doc, { html: '#transactions-table' });
    doc.save('transactions.pdf');
  }

  unsubscribe(): void {
    this.subscription.unsubscribe();
  }
}
