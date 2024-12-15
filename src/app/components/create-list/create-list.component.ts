import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css'],
})
export class CreateListComponent {
  listName: string = ''; // Nome da lista
  listDescription: string = ''; // Descrição da lista
  searchQuery: string = ''; // Pesquisa na barra
  searchResults: any[] = []; // Resultados da busca
  addedGames: any[] = []; // Jogos adicionados à lista

  constructor(private gameService: GameService, private listService: ListService) {}

  // Atualiza a lista de resultados conforme o usuário digita
  onSearchInput() {
    if (this.searchQuery.trim()) {
      this.gameService.searchGames(this.searchQuery).subscribe(
        (response) => {
          this.searchResults = response.results.slice(0, 10); // Limita a 10 resultados
        },
        (error) => console.error('Erro ao buscar jogos:', error)
      );
    } else {
      this.searchResults = [];
    }
  }

  // Adiciona o jogo à lista
  addGameToList(game: any) {
    const exists = this.addedGames.some((addedGame) => addedGame.id === game.id);
    if (!exists) {
      this.addedGames.push(game);
    }
  }

  // Remove o jogo da lista
  removeGameFromList(game: any) {
    this.addedGames = this.addedGames.filter((addedGame) => addedGame.id !== game.id);
  }

  saveList() {
    if (this.listName && this.listDescription && this.addedGames.length > 0) {
      const newList = {
        name: this.listName,
        description: this.listDescription,
        games: this.addedGames,
      };

      this.listService.saveList(newList).subscribe(
        () => {
          alert('Lista salva com sucesso!');
          this.listName = '';
          this.listDescription = '';
          this.addedGames = [];
          this.searchQuery = '';
          this.searchResults = [];
        },
        (error) => {
          console.error('Erro ao salvar lista:', error);
          alert('Erro ao salvar a lista. Tente novamente.');
        }
      );
    } else {
      alert('Preencha todos os campos obrigatórios!');
    }
  }
}
