import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {
  public iban: string = '';
  public pin: string = '';
  public bank: string = '';
  public invalidNickname: string = '';
  public account_name: string = '';
  public account_type: string = '';
  public account_coin: string = '';
  public banks = [] as any;
  public ok: boolean = false;

  constructor(private firestore: AngularFirestore, public auth: AuthenticationService, private router: Router) {
    this.firestore.collection('banks').valueChanges().subscribe((bnk: any) => this.banks = bnk);
  }

  ngOnInit(): void {
  }

  submitRequest() {
    this.ok = true;
    this.firestore.collection('accounts', ref => ref.where("account_name", "==", this.account_name)).get()
      .toPromise().then((data: any) => {
        data.forEach((element: any) => {
          element['user_id'].get().then((result: any) => {
            if (result.data() != undefined && result.data()['username'] == this.auth.getCurrentUser()) {
              this.invalidNickname = this.account_name;
              this.ok = false;
            }
          });
        });
      });
    if (this.ok) {
      this.firestore.collection('requests').add({
        requestType: "verify",
        timestamp: new Date(),
        iban: this.iban,
        pin: this.pin,
        bank: this.firestore.doc('banks/' + this.bank).ref,
        account_name: this.account_name,
        type: this.account_type,
        coin: this.account_coin,
        email: this.auth.getCurrentUser()
      })
      .then((docRef) => {
        this.firestore.collection('requests').doc(docRef.id).update({ requestID: docRef.id })
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
      alert("Your request has been sent!");
      this.router.navigateByUrl('card-select');
    } 
  }

  nicknameInUse() {
    return this.invalidNickname == this.account_name;
  }
}
