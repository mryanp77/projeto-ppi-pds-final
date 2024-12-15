import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopularGamesComponent } from './components/popular-games/popular-games.component';
import { GameDetailsComponent } from './pages/game-details/game-details.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangeUsernameComponent } from './components/change-username/change-username.component';
import { ChangeEmailComponent } from './components/change-email/change-email.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CreateListComponent } from './components/create-list/create-list.component';

const routes: Routes = [
  { path: '', component: PopularGamesComponent },
  { path: 'game/:id', component: GameDetailsComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'change-username', component: ChangeUsernameComponent },
  { path: 'change-email', component: ChangeEmailComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'create-list', component: CreateListComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
