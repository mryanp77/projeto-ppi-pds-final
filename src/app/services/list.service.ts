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
}
