import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class SearchService {

  // class variables
  keyword = '';
  url = 'http://localhost:3000/api/books';
  result = [];

  constructor(private http: HttpClient, private router: Router) {}

  search() {
    this.result = [];
    let params = new HttpParams();
    params = params.append('keyword', this.keyword);

    // fetch books and store in result
    console.log(this.keyword);
    this.http.get<Book[]>(this.url, {params: params}).subscribe(res => {
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        this.result.push(res[i]);
      }
    });

    // redirect
    this.router.navigate(['/result']);
  }

}
