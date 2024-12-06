import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  searchBarVisible: boolean = false;
  searchQuery: string = '';
  searchResults: any[] = [];
  isDropdownOpen = false;

  constructor(private gameService: GameService, private router: Router) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleSearchBar() {
    this.searchBarVisible = !this.searchBarVisible;
    if (!this.searchBarVisible) {
      this.searchQuery = '';
      this.searchResults = [];
    }
  }

  onSearchInput() {
    if (this.searchQuery.trim()) {
      this.gameService.searchGames(this.searchQuery).subscribe(
        (response) => {
          this.searchResults = response.results.slice(0, 5);
        },
        (error) => console.error('Erro ao buscar jogos:', error)
      );
    } else {
      this.searchResults = [];
    }
  }

  navigateToGame(gameId: number) {
    this.router.navigate([`/game/${gameId}`]);
    this.toggleSearchBar();
  }

  searchGames() {
    this.toggleSearchBar();
    this.router.navigate(['/search-results'], {
      queryParams: { query: this.searchQuery },
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const targetElement = event.target as HTMLElement;
    const searchBar = document.getElementById('search-bar');
    const searchIcon = document.getElementById('search-icon');
    const searchResults = document.getElementById('search-results');

    if (
      this.searchBarVisible &&
      searchBar &&
      !searchBar.contains(targetElement) &&
      searchIcon &&
      !searchIcon.contains(targetElement) &&
      searchResults &&
      !searchResults.contains(targetElement)
    ) {
      this.toggleSearchBar();
    }
  }
}
