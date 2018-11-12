import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { timeout } from 'q';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('formElement') formElement: ElementRef;

  // class variables
  acct: User;
  subscription: Subscription;

  constructor(public loginService: LoginService, private modalService: NgbModal) {}

  ngOnInit() {
    this.subscription = this.loginService.observableAcct.subscribe(acct => {
      this.acct = acct;
    });
  }

  onSubmit(message: any) {
    this.loginService.login();

    // js async problem
    /*if () {
      this.formElement.nativeElement.ownerDocument.activeElement.blur();
      this.modalService.open(message);
    }*/
  }

}
