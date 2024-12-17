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
  listId: string | null = null; // O ID da lista pode ser null inicialmente
  listName: string = '';
  listDescription: string = '';
  addedGames: any[] = [];
  searchQuery: string = ''; // Para armazenar a pesquisa do usuário
  searchResults: any[] = []; // Para armazenar os jogos encontrados
  isEditing: boolean = false; // Controle de edição

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private listService: ListService,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    // Obtém o 'listId' da URL (parametro de rota)
    this.listId = this.route.snapshot.paramMap.get('listId');

    if (this.listId) {
      this.loadListDetails(this.listId); // Chama a função para carregar os detalhes da lista
    } else {
      console.error('ID da lista não encontrado!');
      // Se o 'listId' não for encontrado, redireciona para a página inicial ou outra ação
      this.router.navigate(['/']);
    }
  }

  // Habilita a edição do nome e descrição
  editList(): void {
    this.isEditing = true;
  }

  // Função para carregar os detalhes da lista a partir do ID
  loadListDetails(listId: string): void {
    this.http.get(`http://localhost:3000/api/list-details/${listId}`).subscribe(
      (data: any) => {
        this.listName = data.name;
        this.listDescription = data.description;
        this.addedGames = data.games; // Aqui você armazena os jogos
      },
      (error) => {
        console.error('Erro ao carregar os detalhes da lista:', error);
      }
    );
  }

  // Função para salvar as alterações feitas no nome ou descrição da lista
  saveChanges(): void {
    const updatedList = {
      name: this.listName, // Nome da lista atualizado
      description: this.listDescription, // Descrição da lista atualizada
      games: this.addedGames, // Lista de jogos (não alterada diretamente)
    };

    console.log('Dados a serem enviados para o backend:', updatedList); // Log para verificar os dados

    // Chama o serviço para atualizar a lista no backend
    this.listService.updateList(this.listId!, updatedList).subscribe(
      (response) => {
        console.log('Resposta do backend:', response); // Log para verificar a resposta
        alert('Lista atualizada com sucesso!'); // Exibe uma mensagem de sucesso
        this.isEditing = false; // Desativa o modo de edição após salvar
      },
      (error) => {
        console.error('Erro ao salvar as alterações:', error); // Exibe uma mensagem de erro
      }
    );
  }

  // Cancela a edição e restaura os valores originais
  cancelEdit(): void {
    this.isEditing = false;
    this.loadListDetails(this.listId!); // Restaura os dados originais
  }

  // Pesquisa jogos com base na entrada do usuário
  onSearchInput() {
    if (this.searchQuery.trim()) {
      this.gameService.searchGames(this.searchQuery).subscribe(
        (response) => {
          console.log(response);  // Adicionando o log para ver a estrutura da resposta
          this.searchResults = response.results.slice(0, 10); // Limita a 10 resultados
        },
        (error) => console.error('Erro ao buscar jogos:', error)
      );
    } else {
      this.searchResults = [];
    }
  }

  addGameToList(game: any) {
    const gameData = {
      listId: this.listId, // Certifique-se de que o listId está definido
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
    // Certifique-se de que o gameId está sendo passado corretamente
    const gameId = game.game_id;  // Ou game.id, dependendo do seu objeto
    const listId = this.listId;  // Certifique-se de que a listId está correta
    
    this.http.delete(`http://localhost:3000/api/lists/remove-game/${listId}/${gameId}`)
      .subscribe(
        (response) => {
          console.log('Jogo removido da lista!');
          // Atualize a lista de jogos removendo o jogo removido
          this.addedGames = this.addedGames.filter((g) => g.game_id !== gameId); // Filtra o jogo removido
        },
        (error) => {
          console.error('Erro ao remover jogo:', error);
        }
      );
  }

  // Adicionar um jogo diretamente à lista (exemplo)
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
