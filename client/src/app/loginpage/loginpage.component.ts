import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { constructor } from 'q';



@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {


  options: FormGroup;
  hide: false;

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' : '';
  }





  constructor(fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {

  }

}
