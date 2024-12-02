import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class GameService {
  private API_URL = 'https://api.rawg.io/api';
  private API_KEY = 'c3effaf7b27d42ec85e6e22357e9fec8';

  constructor(private http: HttpClient) { }

  getPopularGames(): Observable<any> {
    return this.http.get(`${this.API_URL}/games`, {
      params: {
        key: this.API_KEY,
        ordering: '-added',
        genres: 'action,adventure,indie',
        exclude_additions: 'true',
        page_size: '12',
      },
    });
  }

  getGameDetails(gameId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/games/${gameId}`, {
      params: { key: this.API_KEY },
    });
  }
}