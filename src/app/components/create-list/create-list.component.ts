import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ListService } from '../../services/list.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css'],
})
export class CreateListComponent implements OnInit {
  listName: string = ''; // Nome da lista
  listDescription: string = ''; // Descrição da lista
  searchQuery: string = ''; // Pesquisa na barra
  searchResults: any[] = []; // Resultados da busca
  addedGames: any[] = []; // Jogos adicionados à lista
  userEmail: string | null = null; // Mudança para verificar o email, não o id

  constructor(
    private gameService: GameService,
    private listService: ListService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router // Importando Router para navegação
  ) {}

  ngOnInit(): void {
    // Recuperar userEmail do AuthService ou localStorage
    this.userEmail = localStorage.getItem('userEmail');
    
    // Verifica se o usuário está autenticado
    if (!this.userEmail) {
      console.error('Usuário não autenticado!');
      this.router.navigate(['/login']); // Redireciona para a página de login caso não esteja autenticado
      return;
    }
    console.log('Usuário autenticado: ', this.userEmail); // Confirmação do email do usuário
  }

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

  createList(): void {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!this.listName || !this.listDescription || !this.userEmail) {
      console.error('Preencha todos os campos!');
      return;
    }

    // Prepara os dados para a requisição
    const listData = {
      name: this.listName,
      description: this.listDescription,
      games: this.addedGames,
      user_email: this.userEmail, // Enviar email do usuário
    };

    console.log('Dados da lista:', listData); // Verifique o que está sendo enviado

    // Envia a requisição para o backend
    this.http.post('http://localhost:3000/api/lists', listData).subscribe(
      (response) => {
        console.log('Lista criada com sucesso:', response);
        // Limpa os campos após salvar a lista
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

  // Salva a lista (chama o método de criação de lista)
  saveList() {
    this.createList(); // Chama o método de criar lista
  }
}
