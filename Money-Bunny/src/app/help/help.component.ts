import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  tipHelp = "";
  constructor(public route: Router) {
    this.tipHelp = route.url.split("=")[1];
  }

  ngOnInit(): void {
  }

}
