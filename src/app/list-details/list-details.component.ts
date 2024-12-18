import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ListService } from '../services/list.service';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.css'],
})
export class ListDetailsComponent implements OnInit {
  listId: string | null = null;
  listName: string = '';
  listDescription: string = '';
  addedGames: any[] = [];
  searchQuery: string = '';
  searchResults: any[] = [];
  isEditing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private listService: ListService,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('listId');

    if (this.listId) {
      this.loadListDetails(this.listId);
    } else {
      console.error('ID da lista não encontrado!');
      this.router.navigate(['/']);
    }
  }

  editList(): void {
    this.isEditing = true;
  }

  loadListDetails(listId: string): void {
    this.http.get(`http://localhost:3000/api/list-details/${listId}`).subscribe(
      (data: any) => {
        this.listName = data.name;
        this.listDescription = data.description;
        this.addedGames = data.games;
      },
      (error) => {
        console.error('Erro ao carregar os detalhes da lista:', error);
      }
    );
  }

  saveChanges(): void {
    const updatedList = {
      name: this.listName,
      description: this.listDescription,
      games: this.addedGames,
    };

    console.log('Dados a serem enviados para o backend:', updatedList);

    this.listService.updateList(this.listId!, updatedList).subscribe(
      (response) => {
        console.log('Resposta do backend:', response);
        alert('Lista atualizada com sucesso!');
        this.isEditing = false;
      },
      (error) => {
        console.error('Erro ao salvar as alterações:', error);
      }
    );
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadListDetails(this.listId!);
  }

  onSearchInput() {
    if (this.searchQuery.trim()) {
      this.gameService.searchGames(this.searchQuery).subscribe(
        (response) => {
          console.log(response);
          this.searchResults = response.results.slice(0, 10);
        },
        (error) => console.error('Erro ao buscar jogos:', error)
      );
    } else {
      this.searchResults = [];
    }
  }

  addGameToList(game: any) {
    const gameData = {
      listId: this.listId,
      gameId: game.id,
      gameName: game.name,
      backgroundImage: game.background_image,
    };

    this.http.post('http://localhost:3000/api/lists/add-game-to-list', gameData)
      .subscribe(
        response => {
          console.log('Jogo adicionado à lista!', response);
        },
        error => {
          console.error('Erro ao adicionar o jogo:', error);
        }
      );
  }

  removeGameFromList(game: any): void {
    const gameId = game.game_id;
    const listId = this.listId;

    this.http.delete(`http://localhost:3000/api/lists/remove-game/${listId}/${gameId}`)
      .subscribe(
        (response) => {
          console.log('Jogo removido da lista!');
          this.addedGames = this.addedGames.filter((g) => g.game_id !== gameId);
        },
        (error) => {
          console.error('Erro ao remover jogo:', error);
        }
      );
  }

  addGame(): void {
    const selectedGame = {
      id: 1,
      game_name: 'Novo Jogo',
      background_image: 'url-da-imagem',
    };
    this.addedGames.push(selectedGame);

    this.listService.addGameToList(this.listId!, selectedGame).subscribe(
      (response) => {
        console.log('Jogo adicionado com sucesso!');
      },
      (error) => {
        console.error('Erro ao adicionar jogo:', error);
      }
    );
  }
}