import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bank-select',
  templateUrl: './bank-select.component.html',
  styleUrls: ['./bank-select.component.css']
})
export class BankSelectComponent implements OnInit {

  bank: string = 'none';
  accountType: string = '';
  currency: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  onSelectBank(bankCode: string) {
    this.bank = bankCode;
  }

  setAccount(event: Event) {
    this.accountType = (<HTMLInputElement>event.target).value;
  }

  setCurrency(event: Event) {
    this.currency = (<HTMLInputElement>event.target).value;
  }
}
