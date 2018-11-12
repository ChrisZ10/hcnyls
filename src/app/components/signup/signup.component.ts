import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { LoginService } from '../../services/login.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @ViewChild('formElement') formElement: ElementRef;

  // class variables
  isValid = false;
  isSuccessful = false;
  url = 'http://localhost:3000/api/signup';

  email: string;
  fname: string;
  lname: string;
  pwd: string;
  cpwd: string;

  constructor(private http: HttpClient, private router: Router, private loginService: LoginService,
    private modalService: NgbModal) { }

  ngOnInit() {
  }

  onChanges() {
    // check if input is valid
    if (this.email === undefined || this.fname === undefined || this.lname === undefined || this.pwd === undefined) {
      this.isValid = false;
    } else if (this.pwd !== undefined && (this.pwd.length < 6 || this.pwd !== this.cpwd)) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }

  onSubmit(message: any) {
    if (this.isValid === true) {
      let user: User;
      user = {
        email: this.email,
        fname: this.fname,
        lname: this.lname,
        pwd: this.pwd,
        processing: [],
        pickup: [],
        checkout: []
      };

      // send to backend
      this.http.post<{message: string, user: User}>(this.url, user).subscribe(res => {
        this.isSuccessful = false;
        console.log(res);
        if (res.message === 'success') {
          this.isSuccessful = true;

          // update account info via login service
          this.loginService.acct = res.user;

          // redirect
          this.router.navigate(['/account/' + this.loginService.acct.email]);
        } else {
          this.isSuccessful = false;
        }
        console.log(this.isSuccessful);
      });

    } else {
      console.log('invalid input');
      this.formElement.nativeElement.ownerDocument.activeElement.blur();
      this.modalService.open(message);
    }
  }

}
