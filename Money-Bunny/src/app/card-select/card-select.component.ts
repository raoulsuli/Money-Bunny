import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { ModalRenameCardComponent } from '../modal-rename-card/modal-rename-card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-card-select',
  templateUrl: './card-select.component.html',
  styleUrls: ['./card-select.component.css']
})
export class CardSelectComponent implements OnInit {

  public accounts = [] as any;
  public banks = new Map();
  private subscription: Subscription;
  public name: string = '';
  
  constructor(private firestore: AngularFirestore, public auth: AuthenticationService, private router: Router,
    public modalService: NgbModal) {

    this.subscription = this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      data.forEach((element: any) => {
        console.log(element);
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

  openModal(account: any) {
    const modalRef = this.modalService.open(ModalRenameCardComponent);
    modalRef.componentInstance.user = this.name;
    modalRef.result.then((result) => {
      if (result) {
        this.firestore.collection('accounts').doc(account['IBAN']).update({account_name: result}).then(() => {
          this.refresh();
        });
        
      }
    });
  }

  blockAccount(account: any) {
    var response = confirm("Are you sure you want to block this account?");
    if (response) {
      this.firestore.collection('accounts').doc(account['IBAN']).update({blocked: true});
      this.auth.unsetCurrentAccount();
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
        timestamp: new Date(),
        bank: account['bank_id'],
		    iban: account['IBAN']
      })
      .then((docRef) => {
        this.firestore.collection('requests').doc(docRef.id).update({ requestID: docRef.id })
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
      alert("Your request has been sent!");
      this.refresh()
    }
  }

  ngOnInit(): void {
  }
}
