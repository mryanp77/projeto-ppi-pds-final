import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styleUrls: ['./user-comments.component.css'],
})
export class UserCommentsComponent implements OnInit {
  userEmail: string | null = null;
  userComments: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail');

    if (this.userEmail) {
      this.http
        .get(`http://localhost:3000/api/comments/user/${this.userEmail}`)
        .subscribe(
          (comments: any[]) => {
            this.userComments = comments;
          },
          (error) => {
            console.error('Erro ao buscar comentários do usuário:', error);
          }
        );
    } else {
      console.error('Email do usuário não encontrado!');
    }
  }
}