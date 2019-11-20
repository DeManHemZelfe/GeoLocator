import { Injectable } from '@angular/core';
import User from '../interfaces/user.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:5000/api/';

  private user: User;

  constructor(private http: HttpClient) { }

  authenticate(signInCredentials: { email: string, password: string, group: number }) {
    return this.http.post(`${this.url}user/authenticate`, signInCredentials);
  }

  getUserById(id: number): Observable<HttpResponse<object>> {
    return this.http.get(`${this.url}user/2`, { observe: 'response' });
  }
}
