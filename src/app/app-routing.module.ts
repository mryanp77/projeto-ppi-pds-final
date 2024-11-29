import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopularGamesComponent } from './components/popular-games/popular-games.component';

const routes: Routes = [
  { path: '', component: PopularGamesComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
