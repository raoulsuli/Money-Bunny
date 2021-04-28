import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    var user = (<HTMLInputElement>document.getElementById('username')).value;
    var pass = (<HTMLInputElement>document.getElementById('password')).value;
    axios.post('http://ec2-18-156-2-153.eu-central-1.compute.amazonaws.com:3000/login', {'user' : user, 'pass' : pass}).then((response) => {
      if (response) {
        this.router.navigateByUrl('/logged-in-menu')
      }
    }).catch((err) => {
      console.log(err);
    });
  }
}
