import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private apiUrl = 'http://localhost:3000/api/lists';

  constructor(private http: HttpClient) {}

  saveList(list: any): Observable<any> {
    return this.http.post(this.apiUrl, list);
  }

  getLists() {
    return this.http.get(this.apiUrl);
  }

  // Método para buscar as listas de um usuário
  getListsByUserEmail(userEmail: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/lists?user_email=${userEmail}`);
  }
}