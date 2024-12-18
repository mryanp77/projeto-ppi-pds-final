import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  searchBarVisible: boolean = false;
  searchQuery: string = '';
  searchResults: any[] = [];
  isDropdownOpen: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private gameService: GameService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout(); 
    this.router.navigate(['/login']); 
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
