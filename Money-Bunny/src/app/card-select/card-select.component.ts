import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-card-select',
  templateUrl: './card-select.component.html',
  styleUrls: ['./card-select.component.css']
})
export class CardSelectComponent implements OnInit {

  public accounts = [] as any;
  public banks = new Map();
  
  constructor(private firestore: AngularFirestore, public auth: AuthenticationService, private router: Router) {
    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      if (this.accounts.length != 0) return;
      data.forEach((element: any) => {
        element['user_id'].get().then((result: any) => {
          if (result.data()['username'] == auth.getCurrentUser()) {
            this.accounts.push(element);
            element['bank_id'].get().then((res: any) => this.banks.set(element['account_name'], res.data()['name']));
          }
        });
      });
    });
  }

  selectAccount(account: any) {
    this.auth.setCurrentAccount(account);
    this.router.navigateByUrl('/account-dashboard');
  }

  ngOnInit(): void {
  }
}
