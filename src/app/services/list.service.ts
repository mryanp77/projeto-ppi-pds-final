import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private apiUrl = 'http://localhost:3000/api/lists'; // URL base da API

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

  // Obtém os detalhes de uma lista
  getListDetails(listId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${listId}`);
  }

  // Método para atualizar a lista
updateList(listId: string, updatedList: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/update-list/${listId}`, updatedList);
}

  // Método para adicionar um jogo à lista
  addGameToList(listId: string, game: any): Observable<any> {
    // Faz a requisição POST ao servidor com os dados necessários
    return this.http.post(`${this.apiUrl}/add-game-to-list`, {
      listId: listId,
      gameId: game.id,
      gameName: game.game_name,
      backgroundImage: game.background_image,
    });
  }

  // Método para remover um jogo da lista
  removeGameFromList(listId: string, gameId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-game/${listId}/${gameId}`);
  }

  // Pesquisa jogos com base na query fornecida
  searchGames(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search-games?query=${query}`);
  }
}
