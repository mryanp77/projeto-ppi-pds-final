import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
<<<<<<< HEAD
  providedIn: 'root',
})
export class UserService {
=======
  providedIn: 'root'
})
export class UserService {

>>>>>>> 02f110e53c459f29b63c88c0f667078fbc5f63a9
  private apiUrl = 'http://localhost:3000/api'; // URL base da sua API

  constructor(private http: HttpClient) {}

<<<<<<< HEAD
  updateUserData(currentEmail: string, updatedData: any): Observable<any> {
    const apiUrl = `http://localhost:3000/api/user/${currentEmail}`;
    return this.http.put(apiUrl, updatedData); // Faz uma requisição PUT
=======
  // Método para atualizar os dados do usuário
  updateUserData(email: string, userData: { username: string, email: string, password: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${email}`, userData); // Supondo que a API esteja esperando uma requisição PUT para atualizar o usuário
>>>>>>> 02f110e53c459f29b63c88c0f667078fbc5f63a9
  }
}
