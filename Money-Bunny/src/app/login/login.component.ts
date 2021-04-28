import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    var user = (<HTMLInputElement>document.getElementById('username')).value;
    var pass = (<HTMLInputElement>document.getElementById('password')).value;
    axios.post('http://localhost:8080/login', {'user' : user, 'pass' : pass}).then((response) => {
      console.log(response);
    }).catch((err) => {
      console.log(err);
    });
  }
}
