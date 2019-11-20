import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import User from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  JWTToken: string = localStorage.getItem('JWT');

  constructor(private router: Router, private service: UserService) { }

  ngOnInit() {
    // if (!this.user) {
    //   this.router.navigateByUrl('/login');
    // }
    if (!this.JWTToken) {
      this.router.navigateByUrl('/login');
    }
  }

}
