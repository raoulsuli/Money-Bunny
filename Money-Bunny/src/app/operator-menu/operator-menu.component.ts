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

  user: any;
  public requests = [] as any;
  public requestData = new Map();
  private subscription: Subscription;
  
  constructor(private firestore: AngularFirestore, public auth: AuthenticationService, private router: Router) {
    this.firestore.collection('users').doc(this.auth.getCurrentUser()).get().toPromise().then((doc) => {
      if (doc.exists) {
        this.user = doc.data();
      } else {
          console.log("No such document!");
          return;
      }
    }).catch((error: any) => {
        console.log("Error getting document:", error);
        return;
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

  acceptRequest(request: any) {
    if (request['requestType'] === 'open') {

    }
    else if (request['requestType'] === 'close') {
      this.firestore.collection('accounts').doc(request['iban']).delete().then(() => {
        console.log("Document successfully deleted!");

        this.firestore.collection('requests').doc(request['requestID']).delete().then(() => {
          console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
    }
    console.log(request);
  }

  ngOnInit(): void {
  }

}
