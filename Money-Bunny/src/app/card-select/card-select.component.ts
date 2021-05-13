import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-card-select',
  templateUrl: './card-select.component.html',
  styleUrls: ['./card-select.component.css']
})
export class CardSelectComponent implements OnInit {

  public accounts = [] as any;
  public banks = new Map();
  private subscription: Subscription;
  
  constructor(private firestore: AngularFirestore, public auth: AuthenticationService, private router: Router) {
    this.subscription = this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        element['user_id'].get().then((result: any) => {
          if (result.data() != undefined && result.data()['username'] == auth.getCurrentUser()) {
            this.accounts.push(element);
            element['bank_id'].get().then((res: any) => this.banks.set(element['account_name'], res.data()['name']));
          }
        });
      });
      this.unsubscribe();
    });
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }

  refresh(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigateByUrl('card-select'));
 }

  selectAccount(account: any) {
    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        if (element['account_name'] == account) {
          this.firestore.doc(element['user_id']).get().toPromise().then((result: any) => {
            console.log("res",result.data());
            var res = result.data();
            if (res['username'] == this.auth.getCurrentUser()) {
              this.auth.setCurrentAccount(account);
              this.auth.setCurrentIBAN(element['IBAN']);
              this.router.navigateByUrl('/account-dashboard');
            }
          });
        }
      });
    });
  }

  blockAccount(account: any) {
    var response = confirm("Are you sure you want to block this account?");
    if (response) {
      this.firestore.collection('accounts').doc(account['IBAN']).update({blocked: true});
      alert("Success");
      this.refresh()
    }
  }

  unblockAccount(account: any) {
    var response = confirm("Are you sure you want to unblock this account?");
    if (response) {
      this.firestore.collection('accounts').doc(account['IBAN']).update({blocked: false});
      alert("Success");
      this.refresh()
    }
  }

  closeAccount(account: any) {
    var response = confirm("Are you sure you want to close this account?\nThis action is irreversible, once accepted by an Operator!");
    if (response) {
      this.firestore.collection('accounts').doc(account['IBAN']).update({closing: true});
      this.firestore.collection('requests').add({
        requestType: "close",
		    iban: account['IBAN']
      });
      alert("Your request has been sent!");
      this.refresh()
    }
  }

  ngOnInit(): void {
  }
}
