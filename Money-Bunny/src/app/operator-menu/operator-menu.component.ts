import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-operator-menu',
  templateUrl: './operator-menu.component.html',
  styleUrls: ['./operator-menu.component.css']
})
export class OperatorMenuComponent implements OnInit {
  public user: any;
  public requests = [] as any;
  private subscription: Subscription;
  public user_types: any = { 'pfizica' : 'Persoana Fizica', 'pjuridica' : 'Persoana Juridica'};
  public balance: number = 0;
  public iban: string = '';
  public pin: string = '';

  ngOnInit(): void { }

  constructor(private firestore: AngularFirestore, public auth: AuthenticationService, private router: Router) {
    this.firestore.collection('users').doc(this.auth.getCurrentUser()).get().toPromise().then((doc) => {
      this.user = doc.data();
    });

    this.subscription = this.firestore.collection('requests').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        element['bank'].get().then((req: any) => {
          this.user.bank.get().then((op: any) => {
            if (req.id == op.id) {
              this.requests.push(element);
            }
          });
        });
      });
      this.unsubscribe();
    });
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }

  accept(request: any) {
    if (request['requestType'] == 'open') {
      this.firestore.collection('users', ref => ref.where("email", "==", request['email'])).get()
      .toPromise().then((result: any) => {
        result.forEach((element: any) => {
            if (element.data() != undefined) {
              this.firestore.collection('accounts').doc(this.iban).set({
                IBAN: this.iban,
                PIN: this.pin,
                account_name: request['account_name'],
                account_type: request['type'],
                balance: this.balance,
                bank_id: this.user.bank,
                open_date: new Date(),
                blocked: false,
                closing: false,
                currency: request['coin'],
                user_id: this.firestore.doc('users/' + element.data().username).ref
              });

              this.firestore.collection('requests').doc(request['requestID']).delete();
              alert("Success");
              this.refresh();
            }
        });
      });
    } else if (request['requestType'] == 'close') {
      this.firestore.collection('accounts').doc(request['iban']).delete();
      this.firestore.collection('requests').doc(request['requestID']).delete();
      alert("Success");
      this.refresh();
    } else {
      this.firestore.collection('users', ref => ref.where("username", "==", request['email'])).get()
      .toPromise().then((result: any) => {
        result.forEach((element: any) => {
            if (element.data() != undefined) {
              this.firestore.collection('accounts').doc(request['iban']).set({
                IBAN: request['iban'],
                PIN: request['pin'],
                account_name: request['account_name'],
                account_type: request['type'],
                balance: this.balance,
                bank_id: this.user.bank,
                open_date: new Date(),
                blocked: false,
                closing: false,
                currency: request['coin'],
                user_id: this.firestore.doc('users/' + element.data().username).ref
              });

              this.firestore.collection('requests').doc(request['requestID']).delete();
              alert("Success");
              this.refresh();
            }
        });
      });
    }
  }

  deny(request: any) {
    if (request['requestType'] == 'close') {
      this.firestore.collection('accounts').doc(request['iban']).update({closing: false});
    }
    this.firestore.collection('requests').doc(request['requestID']).delete();
    alert("Success");
    this.refresh();
  }

  refresh(){
    this.router.navigateByUrl('/help', {skipLocationChange: true}).then(()=>
    this.router.navigateByUrl('operator-menu'));
  }
}
