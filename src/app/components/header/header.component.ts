import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // class variables
  acct: User;
  subscription: Subscription;

  constructor(public loginService: LoginService) { }

  ngOnInit() {
    this.subscription = this.loginService.observableAcct.subscribe(acct => {
      this.acct = acct;
    });
  }

}
