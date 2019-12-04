import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors} from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import Group from 'src/app/_interfaces/group.interface';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  // formgroup class for a reactive form
  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
    group: new FormControl(null, Validators.required)
  });

  loginError: string;

  // select values for the dropdown
  groups: Array<{ name: string, value: number }> = new Array<{ name: string, value: number }>();

  constructor(private groupService: GroupService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.groupService.getAllGroups()
      .subscribe((data: Array<Group>) => {
        for (let i = 0, n = data.length; i < n; i++) {
          this.groups.push({ name: data[i].name, value: data[i].id });
        }
      });
  }

  authenticate() {
    console.log(this.form.get('email'));
    if (this.form.invalid) {
      return;
    }

    this.userService.login(this.form.value)
      .pipe(first())
      .subscribe(data => {
        if (data.error) {
          this.loginError = data.error;
        } else {
          this.loginError = null;
          localStorage.setItem('JWT', data.response);
        }
        this.router.navigateByUrl('');
      }, err => this.form.setErrors({ error: 'could not authenticate' }));
  }

  get email() { return this.form.get('email'); }

  get password() { return this.form.get('password'); }

  get group() { return this.form.get('group'); }

}
