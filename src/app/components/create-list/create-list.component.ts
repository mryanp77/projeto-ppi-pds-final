import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css'],
})
export class CreateListComponent implements OnInit {
  listName: string = '';
  listDescription: string = '';
  searchQuery: string = '';
  searchResults: any[] = [];
  addedGames: any[] = [];
  userEmail: string | null = null;

  constructor(
    private gameService: GameService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail');

    if (!this.userEmail) {
      console.error('Usuário não autenticado!');
      this.router.navigate(['/login']);
      return;
    }
    console.log('Usuário autenticado: ', this.userEmail);
  }

  onSearchInput() {
    const query = this.searchQuery?.trim();

    if (query && query.length > 0) {
      this.gameService.searchGames(query).subscribe(
        (response) => {
          this.searchResults = response.results.slice(0, 10);
        },
        (error) => console.error('Erro ao buscar jogos:', error)
      );
    } else {
      this.searchResults = [];
    }
  }

  addGameToList(game: any) {
    const exists = this.addedGames.some(
      (addedGame) => addedGame.id === game.id
    );
    if (!exists) {
      this.addedGames.push(game);
    }
  }

  removeGameFromList(game: any) {
    this.addedGames = this.addedGames.filter(
      (addedGame) => addedGame.id !== game.id
    );
  }

  createList(): void {
    if (!this.listName || !this.listDescription || !this.userEmail) {
      console.error('Preencha todos os campos!');
      return;
    }

    const listData = {
      name: this.listName,
      description: this.listDescription,
      games: this.addedGames,
      user_email: this.userEmail,
    };

    console.log('Dados da lista:', listData);

    this.http.post('http://localhost:3000/api/lists', listData).subscribe(
      (response) => {
        console.log('Lista criada com sucesso:', response);
        this.listName = '';
        this.listDescription = '';
        this.addedGames = [];
        this.searchQuery = '';
        this.searchResults = [];
      },
      (error) => {
        console.error('Erro ao criar lista:', error);
      }
    );
  }

  saveList() {
    this.createList();
  }
}