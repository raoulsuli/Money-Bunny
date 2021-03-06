import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { HelpComponent } from './help/help.component';
import { FormsModule } from '@angular/forms';
import { LoggedInMenuComponent } from './logged-in-menu/logged-in-menu.component';
import { BankSelectComponent } from './bank-select/bank-select.component';
import { CardSelectComponent } from './card-select/card-select.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from '../environments/environment';
import { AuthGuardService } from './services/auth-guard.service';
import { OperatorGuardService } from './services/operator-guard.service';
import { NotAuthGuardService } from './services/not-auth-guard.service';
import { AccountDashboardComponent } from './account-dashboard/account-dashboard.component';
import { NotAccountGuardService } from './services/not-account-guard.service';
import { NotOperatorGuardService } from './services/not-operator-guard.service';
import { AccountGuardService } from './services/account-guard.service';
import { TransactionComponent } from './transaction/transaction.component';
import { OperatorMenuComponent } from './operator-menu/operator-menu.component';
import { TransactionsReportComponent } from './transactions-report/transactions-report.component';
import { CurrencyConversionComponent } from './currency-conversion/currency-conversion.component';
import { AddCardComponent } from './add-card/add-card.component';
import { ModalRenameCardComponent } from './modal-rename-card/modal-rename-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [NotAuthGuardService, NotAccountGuardService, NotOperatorGuardService]},
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuardService, NotAccountGuardService]},
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuardService, NotAccountGuardService]},
  { path: 'bank-select', component: BankSelectComponent, canActivate: [AuthGuardService, NotAccountGuardService, NotOperatorGuardService]},
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardService, NotAccountGuardService, NotOperatorGuardService]},
  { path: 'logged-in-menu', component: LoggedInMenuComponent, canActivate: [AuthGuardService, NotAccountGuardService, NotOperatorGuardService]},
  { path: 'operator-menu', component: OperatorMenuComponent, canActivate: [AuthGuardService, OperatorGuardService]},
  { path: 'card-select', component: CardSelectComponent, canActivate: [AuthGuardService, NotAccountGuardService, NotOperatorGuardService]},
  { path: 'add-card', component: AddCardComponent, canActivate: [AuthGuardService, NotAccountGuardService, NotOperatorGuardService]},
  { path: 'help', component: HelpComponent},
  { path: 'account-dashboard', component: AccountDashboardComponent, canActivate: [AuthGuardService, AccountGuardService, NotOperatorGuardService]},
  { path: 'transaction', component: TransactionComponent, canActivate: [AuthGuardService, AccountGuardService, NotOperatorGuardService]},
  { path: 'transactions-report', component: TransactionsReportComponent, canActivate: [AuthGuardService, AccountGuardService, NotOperatorGuardService]},
  { path: 'currency-conversion', component: CurrencyConversionComponent, canActivate: [AuthGuardService, AccountGuardService, NotOperatorGuardService]},
  { path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    HelpComponent,
    LoggedInMenuComponent,
    BankSelectComponent,
    CardSelectComponent,
    UserProfileComponent,
    AccountDashboardComponent,
    TransactionComponent,
    OperatorMenuComponent,
    TransactionsReportComponent,
    CurrencyConversionComponent,
    AddCardComponent,
    ModalRenameCardComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
