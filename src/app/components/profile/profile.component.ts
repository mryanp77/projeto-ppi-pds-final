import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators'; // Para usar o switchMap
import { HttpClient } from '@angular/common/http';
import { ListService } from '../../services/list.service';

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

  constructor(
    private authService: AuthService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private listService: ListService
  ) {}

  ngOnInit(): void {
    // Obter o email do usuário logado (assumindo que o email está salvo no localStorage)
    this.userEmail = localStorage.getItem('userEmail');
    
    if (this.userEmail) {
      // Requisição para pegar detalhes do usuário com base no email
      this.http.get(`http://localhost:3000/api/user/${this.userEmail}`).subscribe(
        (data: any) => {
          this.username = data.username;
          this.email = data.email;
          this.createdAt = this.datePipe.transform(data.createdAt, 'shortDate')!;
          this.lastLogin = this.datePipe.transform(data.lastLogin, 'shortDate')!;
        },
        (error) => {
          console.error('Erro ao carregar os dados do usuário:', error);
        }
      );
  
      // Buscar as listas do usuário
      this.getUserLists();
    } else {
      console.error('Email do usuário não encontrado!');
    }
  }
  

  getUserLists(): void {
    if (this.userEmail) {
      // Usar o operador '!' para garantir que userEmail não é null
      this.listService.getListsByUserEmail(this.userEmail!).subscribe(
        (lists) => {
          this.userLists = lists;
          console.log('Listas do usuário:', this.userLists);
        },
        (error) => {
          console.error('Erro ao buscar listas:', error);
        }
      );
    }
  }
}
