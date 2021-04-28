import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Language {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Money-Bunny';
  languages: Language[] = [{value: 'en', viewValue: 'English'}, {value: 'ro', viewValue: 'Română'}];
  language = this.languages[0];

  onUpdateLanguage(newLanguage: Language) {
    this.language = newLanguage;
  }

  constructor(public route: Router) { }
}