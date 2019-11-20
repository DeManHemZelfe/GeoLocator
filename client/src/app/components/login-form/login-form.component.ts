import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import Group from 'src/app/interfaces/group.interface';
import { Router } from '@angular/router';

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
    group: new FormControl(null)
  });

  // select values for the dropdown
  groups: Array<{ name: string, value: number }> = new Array<{ name: string, value: number }>();
  // defaultGroup: { name: string, value: number };

  constructor(private groupService: GroupService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.groupService.getAllGroups()
      .subscribe((data: Array<Group>) => {
        // this.defaultGroup = { name: data[0].name, value: data[0].id };
        for (let i = 0, n = data.length; i < n; i++) {
          this.groups.push({ name: data[i].name, value: data[i].id });
        }
      });
  }

  authenticate() {
    console.log(this.form.value);
    this.userService.authenticate(this.form.value).subscribe((data: any) => {
      if (data.error) {
        this.form.setErrors(data.error);
      } else {
        localStorage.setItem('JWT', data.rawData);
        this.router.navigateByUrl('');
      }
    });
  }

  get email() { return this.form.get('email'); }

  get password() { return this.form.get('password'); }

  get group() { return this.form.get('group'); }

}
