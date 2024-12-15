import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private apiUrl = 'http://localhost:3000/api/lists';

  constructor(private http: HttpClient) {}

  saveList(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getLists() {
    return this.http.get(this.apiUrl);
  }
}
