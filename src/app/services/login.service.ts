import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class LoginService {

  // class variables
  email: string;
  pwd: string;
  url = 'http://localhost:3000/api/login';

  acct: User;
  observableAcct: BehaviorSubject<User>;

  // fake data for admin
  admin_username = 'admin';
  admin_password = '123456';

  constructor(private http: HttpClient, private router: Router) {
    this.observableAcct = new BehaviorSubject<User>(this.acct);
  }

  login() {
    if (this.email === undefined || this.pwd === undefined) {
      console.log('invalid input');
    } else {
      let params = new HttpParams();
      params = params.append('email', this.email);
      params = params.append('pwd', this.pwd);

      this.http.get<{case: number, user: User}>(this.url, {params: params}).subscribe(res => {
        if (res.case === 3) {
          this.acct = res.user;
          this.acctChange();
          // redirect
          this.router.navigate(['/account/' + this.acct.email]);
        } else if (res.case === 1) {
          console.log('no match');
        } else {
          console.log('wrong password');
        }
      });
    }// else ends
  }

  logout() {
    this.acct = undefined;
    this.acctChange();
    this.router.navigate(['/']);
  }

  admin_login(name: string, pwd: string): boolean {
    if (name === this.admin_username && pwd === this.admin_password) {
      return true;
    } else {
      return false;
    }
  }

  acctChange() {
    this.observableAcct.next(this.acct);
  }

}
