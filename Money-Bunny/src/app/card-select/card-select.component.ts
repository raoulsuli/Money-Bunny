import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-card-select',
  templateUrl: './card-select.component.html',
  styleUrls: ['./card-select.component.css']
})
export class CardSelectComponent implements OnInit {

  public banks = [];
  public accounts = [];
  
  constructor(private firestore: AngularFirestore) {
    this.firestore.collection('banks').valueChanges().subscribe((data: any) => {
      this.banks = data;
    });
    this.firestore.collection('accounts').valueChanges().subscribe((data: any) => {
      this.accounts = data;
    });
  }

  ngOnInit(): void {
  }
}
