import { Injectable } from '@angular/core';
import User from '../interfaces/user.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { verify } from 'jsonwebtoken';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:5000/api/';

  constructor(private http: HttpClient, private jwtService: JwtHelperService) {
  }

  get isLoggedIn() {
    return (localStorage.getItem('JWT') !== null);
  }

  login(signInCredentials: { email: string, password: string, group: number }): Observable<{ error: string, response: string }> {
    return this.http.post(`${this.url}user/authenticate`, signInCredentials)
      .pipe(map((data: any) => {
        if (data.error) {
          return  { error: data.error, response: null };
        } else {
          return { error: null, response: data.rawData };
        }
      }));
  }

  logout() {
    localStorage.removeItem('JWT');
  }

  getUserById(id: number): Observable<HttpResponse<object>> {
    return this.http.get(`${this.url}user/2`, { observe: 'response' });
  }
}
