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

  // Função para carregar os detalhes da lista a partir do ID
  loadListDetails(listId: string): void {
    // O "!" aqui informa ao TypeScript que listId não será null ou undefined.
    this.listService.getListDetails(listId).subscribe(
      (data: any) => {
        this.listName = data.name;
        this.listDescription = data.description;
        this.addedGames = data.games; // Carrega os jogos associados à lista
      },
      (error) => {
        console.error('Erro ao carregar os detalhes da lista:', error);
      }
    );
  }

  // Função para salvar as edições feitas no nome ou descrição da lista
  saveChanges(): void {
    const updatedList = {
      name: this.listName,
      description: this.listDescription,
      games: this.addedGames, // Lista de jogos adicionados
    };

    // Chama o serviço para atualizar a lista
    this.listService.updateList(this.listId!, updatedList).subscribe(
      (response) => {
        alert('Lista atualizada com sucesso!');
      },
      (error) => {
        console.error('Erro ao salvar as alterações:', error);
      }
    );
  }

  // Função para adicionar um jogo à lista de jogos
  addGameToList(game: any): void {
    this.addedGames.push(game); // Adiciona o jogo à lista
  }

  // Função para remover um jogo da lista de jogos
  removeGameFromList(game: any): void {
    this.addedGames = this.addedGames.filter(addedGame => addedGame.id !== game.id); // Filtra o jogo que será removido
  }
}
