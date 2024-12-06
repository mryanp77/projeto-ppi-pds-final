import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopularGamesComponent } from './components/popular-games/popular-games.component';
import { GameDetailsComponent } from './pages/game-details/game-details.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';

const routes: Routes = [
  { path: '', component: PopularGamesComponent },
  { path: 'game/:id', component: GameDetailsComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
