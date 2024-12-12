import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api'; // URL base da sua API

  constructor(private http: HttpClient) {}

  updateUserData(currentEmail: string, updatedData: any): Observable<any> {
    const apiUrl = `http://localhost:3000/api/user/${currentEmail}`;
    return this.http.put(apiUrl, updatedData); // Faz uma requisição PUT
  }
}
