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
  isEditing: boolean = false;  // Controle de edição
  
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

  // Salva as alterações feitas na lista
  saveChanges(): void {
    const updatedList = {
      name: this.listName,
      description: this.listDescription,
      games: this.addedGames,
    };

    this.listService.updateList(this.listId!, updatedList).subscribe(
      (response) => {
        alert('Lista atualizada com sucesso!');
        this.isEditing = false;  // Desativa o modo de edição após salvar
      },
      (error) => {
        console.error('Erro ao salvar as alterações:', error);
      }
    );
  }

  // Cancela a edição e restaura os valores originais
  cancelEdit(): void {
    this.isEditing = false;
    this.loadListDetails(this.listId!);  // Restaura os dados originais
  }

  // Função para adicionar um jogo à lista de jogos
  addGameToList(game: any): void {
    this.addedGames.push(game); // Adiciona o jogo à lista
  }

  // Função para remover um jogo da lista de jogos
  removeGameFromList(game: any): void {
    this.addedGames = this.addedGames.filter(addedGame => addedGame.id !== game.id); // Filtra o jogo que será removido
  }

  addGame(): void {
    const selectedGame = { id: 1, game_name: 'Novo Jogo', background_image: 'url-da-imagem' };
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
