import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { Book } from '../../models/book.model';
import { User } from '../../models/user.model';
import { Request } from '../../models/request.model';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  // class variables
  books: Book[];
  url = 'http://localhost:3000/api/request';

  acct: User;
  subscription: Subscription;

  constructor(private searchService: SearchService, private loginService: LoginService,
    private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.books = this.searchService.result;
    console.log(this.books);

    this.subscription = this.loginService.observableAcct.subscribe(acct => {
      this.acct = acct;
    });
  }

  onClick(event: any, i: number) {
    if (this.acct === undefined) {
      console.log('log in first');
      this.router.navigate(['/login']);
    } else {
      // console.log(event);
      // console.log(i);
      event.srcElement.innerHTML = 'requested';
      event.srcElement.disabled = true;

      let request: Request;
      const now = new Date();
      const date = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
      console.log(date);
      request = {
        user: this.acct.email,
        book: this.books[i].title,
        isProcessed: false,
        date: date
      };

      // send request to backend
      let flag = false;
      for (let j = 0; j < this.acct.processing.length; j++) {
        if (this.books[i].title === this.acct.processing[j].title) {
          flag = true;
          break;
        }
      }

      if (!flag) {
        this.http.post<{message: string}>(this.url, request).subscribe(res => {
          console.log(res.message);
        });
      } else {
        console.log('this book is already requested by this user');
      }
    }
  }

}
