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
  public filter: string = "today";
  public dates: any = [] as any;
  private date = new Date;
  public months = ['January ', 'February ', 'March ', 'April ', 'May ', 'June ', 'July ', 'August ',
                  'September ', 'October ', 'November ', 'December '];

  constructor(private firestore: AngularFirestore, private auth: AuthenticationService) {
    for (var i = 0; i < this.months.length; i++) this.months[i] += this.date.getFullYear();
    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      this.all_accounts = data;
      data.forEach((res: any) => {
          if (res['IBAN'] == this.auth.getCurrentIBAN()) {
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
                element['source_iban'] = acc.data()['IBAN'];
              });
              this.transactions.push(element);
              if (!this.dates.includes(element['date'].toDate().getMonth()))
                this.dates.push(element['date'].toDate().getMonth());
                this.dates.sort((t1: number, t2: number) => (t1 > t2 ? 1 : -1));
              this.transactions.sort((t1: Transaction, t2: Transaction) => (t1['date'] < t2['date'] ? 1 : -1));
            }
          })
        });
      });
      this.unsubscribe();
    });
  }

  ngOnInit(): void {}

  downloadPDF() {
    const doc = new jsPDF();
    autoTable(doc, { html: '#transactions-table' });
    doc.save('transactions.pdf');
  }

  unsubscribe(): void {
    this.subscription.unsubscribe();
  }

  getItems() {
    if (this.filter == 'today') return this.transactions.filter((item: any) => item['date'].toDate().toDateString() === this.date.toDateString());
    else if (this.filter == 'lastweek') {
      var last_week = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 7);
      return this.transactions.filter((item: any) => item['date'].toDate() <= this.date && item['date'].toDate() >= last_week)
    }
    return this.transactions.filter((item: any) => item['date'].toDate().getMonth().toString() == this.filter);
  }
}
