import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Request } from '../../models/request.model';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  // class variables
  url = 'http://localhost:3000/api/requests';
  requests: Request[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<Request[]>(this.url).subscribe(res => {
      console.log(res);
      this.requests = res;
    });
  }

  onClick(event: any, i: number) {
    event.srcElement.innerHTML = 'request processed';
    event.srcElement.disabled = true;

    // update book&user info
    this.http.put('http://localhost:3000/api/request',
    {user: this.requests[i].user, book: this.requests[i].book, date: this.requests[i].date})
    .subscribe(res => {
      console.log(res);
    });
  }

}
