import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {

  // class variables for Book instance
  isbn1: string;
  isbn2: string;
  title: string;
  author1: string;
  author2: string;
  desc = '';
  count = 1;

  url = 'http://localhost:3000/api/addbook';

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit() {
    // create book instance
    let book: Book;
    if (this.author2 === undefined) {
      book = {isbn: [this.isbn1, this.isbn2],
              title: this.title,
              author: [this.author1],
              desc: this.desc,
              avail: true,
              count: this.count};
    } else {
      book = {isbn: [this.isbn1, this.isbn2],
        title: this.title,
        author: [this.author1, this.author2],
        desc: this.desc,
        avail: true,
        count: this.count};
    }

    // send to backend
    this.http.post(this.url, book).subscribe(res => {
      console.log('book successfully added to database');
      console.log(res);
    });

  }

}
