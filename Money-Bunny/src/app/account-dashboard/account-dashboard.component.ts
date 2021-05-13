import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-account-dashboard',
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.css']
})
export class AccountDashboardComponent implements OnInit {

  public account: any;
  public bank: any;

  constructor(public auth: AuthenticationService, public firestore: AngularFirestore) {
    var currentAccount = auth.getCurrentIBAN();
  
    firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        if (element['IBAN'] == currentAccount) {
          this.account = element;
          element['bank_id'].get().then((result: any) => this.bank = result.data());
          return;
        }
      });
    });
  }

  ngOnInit(): void {
  }

}