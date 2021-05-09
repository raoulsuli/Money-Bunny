import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-account-dashboard',
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.css']
})
export class AccountDashboardComponent implements OnInit {

  public data = [];
  public bank = Object();

  constructor(public auth: AuthenticationService, public firestore: AngularFirestore) {
    firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      this.data = data;
      data[0]['bank_id'].get().then((result: any) => this.bank = result.data());
    });
  }

  ngOnInit(): void {
  }

}