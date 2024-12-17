import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ListService } from '../services/list.service';

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
    private router: Router
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
  onSearchInput(): void {
    if (this.searchQuery.trim().length > 0) {
      this.listService.searchGames(this.searchQuery).subscribe(
        (results) => {
          this.searchResults = results; // Armazena os resultados da pesquisa
        },
        (error) => {
          console.error('Erro ao buscar jogos:', error);
        }
      );
    } else {
      this.searchResults = []; // Limpa os resultados se a pesquisa estiver vazia
    }
  }

  // Adiciona um jogo à lista de jogos
  addGameToList(game: any): void {
    this.addedGames.push(game); // Adiciona o jogo à lista
    this.listService.addGameToList(this.listId!, game).subscribe(
      (response) => {
        console.log('Jogo adicionado com sucesso!');
      },
      (error) => {
        console.error('Erro ao adicionar jogo:', error);
      }
    );
  }

  // Remove um jogo da lista de jogos
  removeGameFromList(game: any): void {
    this.addedGames = this.addedGames.filter(
      (addedGame) => addedGame.id !== game.id
    ); // Filtra o jogo que será removido
    this.listService.removeGameFromList(this.listId!, game.id).subscribe(
      (response) => {
        console.log('Jogo removido com sucesso!');
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
