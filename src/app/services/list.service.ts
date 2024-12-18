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

  getListsByUserEmail(userEmail: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/lists?user_email=${userEmail}`);
  }

  getListDetails(listId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${listId}`);
  }

updateList(listId: string, updatedList: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/update-list/${listId}`, updatedList);
}

  addGameToList(listId: string, game: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-game-to-list`, {
      listId: listId,
      gameId: game.id,
      gameName: game.game_name,
      backgroundImage: game.background_image,
    });
  }

  removeGameFromList(listId: string, gameId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-game/${listId}/${gameId}`);
  }

  searchGames(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search-games?query=${query}`);
  }
}
