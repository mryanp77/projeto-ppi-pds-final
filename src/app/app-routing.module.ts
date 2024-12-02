import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopularGamesComponent } from './components/popular-games/popular-games.component';
import { GameDetailsComponent } from './pages/game-details/game-details.component';

const routes: Routes = [
  { path: '', component: PopularGamesComponent },
  { path: 'game/:id', component: GameDetailsComponent }, 
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
