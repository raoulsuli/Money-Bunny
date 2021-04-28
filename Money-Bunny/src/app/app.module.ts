import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'bank-select', component: BankSelectComponent},
  { path: 'user-profile', component: UserProfileComponent},
  { path: 'logged-in-menu', component: LoggedInMenuComponent},
  { path: 'card-select', component: CardSelectComponent},
  { path: 'help', component: HelpComponent}
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
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
