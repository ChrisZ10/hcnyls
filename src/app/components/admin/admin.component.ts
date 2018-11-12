import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @ViewChild('formElement') formElement: ElementRef;

  // class variables
  name: string;
  pwd: string;

  admin_isLogged = false;

  constructor(private loginService: LoginService, private modalService: NgbModal) { }

  ngOnInit() {}

  onSubmit(message: any) {
    this.admin_isLogged = this.loginService.admin_login(this.name, this.pwd);
    console.log(this.admin_isLogged);
    if (!this.admin_isLogged) {
      this.formElement.nativeElement.ownerDocument.activeElement.blur();
      this.modalService.open(message);
    }
  }

  onLogout() {
    this.admin_isLogged = false;
  }

}
