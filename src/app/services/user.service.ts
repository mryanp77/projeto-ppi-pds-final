import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api'; // URL base da sua API

  constructor(private http: HttpClient) {}

  // Método para atualizar os dados do usuário
  updateUserData(email: string, userData: { username: string, email: string, password: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${email}`, userData); // Supondo que a API esteja esperando uma requisição PUT para atualizar o usuário
  }
}
