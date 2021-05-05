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

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from '../environments/environment';
import { AuthGuardService } from './services/auth-guard.service';
import { NotAuthGuardService } from './services/not-auth-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [NotAuthGuardService]},
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuardService]},
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuardService]},
  { path: 'bank-select', component: BankSelectComponent, canActivate: [AuthGuardService]},
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardService]},
  { path: 'logged-in-menu', component: LoggedInMenuComponent, canActivate: [AuthGuardService]},
  { path: 'card-select', component: CardSelectComponent, canActivate: [AuthGuardService]},
  { path: 'help', component: HelpComponent},
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
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
