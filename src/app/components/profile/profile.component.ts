import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators'; // Para usar o switchMap
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  username: string = '';
  email: string = '';
  createdAt: string = '';
  lastLogin: string = '';
  userLists: any[] = []; // Armazena as listas do usuário
  userEmail: string | null = null; // Adicionando o campo para email

  constructor(private authService: AuthService, private datePipe: DatePipe, private http: HttpClient) {}

  ngOnInit(): void {
    // Obter o ID do usuário logado (assumindo que o email está salvo no localStorage)
    const userEmail = localStorage.getItem('userEmail');
    
    if (userEmail) {
      // Requisição para pegar detalhes do usuário com base no email
      this.http.get(`http://localhost:3000/api/user/${userEmail}`).subscribe(
        (data: any) => {
          this.username = data.username;
          this.email = data.email;
          // Aqui você pode também tratar a data de criação e último login, se necessário
        },
        (error) => {
          console.error('Erro ao carregar os dados do usuário:', error);
        }
      );
    } else {
      console.error('Email do usuário não encontrado!');
    }
  }
  
}
