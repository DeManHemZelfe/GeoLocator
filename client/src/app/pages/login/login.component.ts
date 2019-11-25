import { Component, OnInit } from '@angular/core';
import { verify as verifyJWT } from 'jsonwebtoken';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // const decoded = verifyJWT(localStorage.getItem('JWT'), 'BA75D4CCA5DCF9DDC13F21EDEC639');
    // console.log(decoded);
  }

}
