import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  // class variables
  acct: User;
  subscription: Subscription;

  constructor(public loginService: LoginService) {}

  ngOnInit() {
    this.subscription = this.loginService.observableAcct.subscribe(acct => {
      this.acct = acct;
    });
  }

  onLogOut() {
    this.loginService.logout();
  }

}
