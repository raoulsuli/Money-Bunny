import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-currency-conversion',
  templateUrl: './currency-conversion.component.html',
  styleUrls: ['./currency-conversion.component.css']
})
export class CurrencyConversionComponent implements OnInit {
  public account: any;
  public amount: number = 0;
  public currency: string = "";
  public currencies = [] as any;
  public rate: number = 0;

  constructor(private auth: AuthenticationService, private firestore: AngularFirestore, private router: Router, private http: HttpClient) {
    this.firestore.collection('accounts').doc(this.auth.getCurrentIBAN()).get().toPromise().then((result: any) => {
      this.account = result.data();
    });
    this.http.get('https://free.currconv.com/api/v7/currencies?apiKey=7272e746547b8c161143').subscribe((res: any) => {
      this.currencies = res['results'];
    });
  }

  ngOnInit(): void {
  }

  transaction() {
    sessionStorage.setItem('convertedAmount', String(this.amount / this.rate));
    this.router.navigateByUrl('transaction');
  }

  selectCurrency() {
    var conv_string = this.account['currency'] + "_" + this.currency;
    var api_string = 'http://free.currencyconverterapi.com/api/v5/convert?q=' + conv_string + '&compact=y&apiKey=7272e746547b8c161143';
    var subscription = this.http.get(api_string).subscribe((res: any) => {
      this.rate = res[conv_string]['val'];
      subscription.unsubscribe();
    });
  }
}
