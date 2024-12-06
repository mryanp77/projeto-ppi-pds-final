import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private API_URL = 'https://api.rawg.io/api';
  private API_KEY = 'b07a5bb97c484fcba2b68d5d6e04b9ea';

  constructor(private http: HttpClient) {}

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

  searchGames(query: string): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/games?search=${query}&key=${this.API_KEY}`
    );
  }
}
