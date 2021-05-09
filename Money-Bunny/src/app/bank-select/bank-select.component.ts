import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { FormPersFizComponent } from '../form-pers-fiz/form-pers-fiz.component';
import { FormPersJurComponent } from '../form-pers-jur/form-pers-jur.component';

@Component({
  selector: 'app-bank-select',
  templateUrl: './bank-select.component.html',
  styleUrls: ['./bank-select.component.css']
})
export class BankSelectComponent implements AfterViewInit {
  @ViewChild(FormPersFizComponent) formfiz?: FormPersFizComponent;
  @ViewChild(FormPersJurComponent) formjur?: FormPersJurComponent;

  bank: string = 'none';
  accountType: string = '';
  currency: string = '';
  user;

  constructor(public auth: AuthenticationService) {
    this.user = this.auth.getCurrentUser();
    
  }

  ngAfterViewInit(): void {
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
