import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  searchBarVisible: boolean = false; // Controla a visibilidade da barra de pesquisa
  searchQuery: string = ''; // Termo digitado na barra de pesquisa
  searchResults: any[] = []; // Resultados da API

  constructor(private gameService: GameService, private router: Router) {}

  // Exibir/Ocultar barra de pesquisa
  toggleSearchBar() {
    this.searchBarVisible = !this.searchBarVisible;
    if (!this.searchBarVisible) {
      this.searchQuery = '';
      this.searchResults = [];
    }
  }

  // Buscar jogos enquanto o usuário digita
  onSearchInput() {
    if (this.searchQuery.trim()) {
      this.gameService.searchGames(this.searchQuery).subscribe(
        (response) => {
          this.searchResults = response.results.slice(0, 5); // Exibir no máximo 5 resultados
        },
        (error) => console.error('Erro ao buscar jogos:', error)
      );
    } else {
      this.searchResults = [];
    }
  }

  // Navegar para página de detalhes do jogo
  navigateToGame(gameId: number) {
    this.router.navigate([`/game/${gameId}`]);
    this.toggleSearchBar();
  }

  // Redirecionar para a página de resultados de pesquisa
  searchGames() {
    this.toggleSearchBar(); // Fechar barra de pesquisa
    this.router.navigate(['/search-results'], { queryParams: { query: this.searchQuery } });
  }

  // Detectar clique fora da barra de pesquisa
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const targetElement = event.target as HTMLElement;
    const searchBar = document.getElementById('search-bar');
    const searchIcon = document.getElementById('search-icon');

    // Verifica se o clique foi fora da barra de pesquisa e do ícone de lupa
    if (
      this.searchBarVisible &&
      searchBar &&
      !searchBar.contains(targetElement) &&
      searchIcon &&
      !searchIcon.contains(targetElement)
    ) {
      this.toggleSearchBar();
    }
  }
}
