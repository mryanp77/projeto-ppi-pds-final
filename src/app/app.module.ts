import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PopularGamesComponent } from './components/popular-games/popular-games.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { GameDetailsComponent } from './pages/game-details/game-details.component';
import { DatePipe } from '@angular/common';
import { JoinGenresPipe } from './pipes/join-genres.pipe';
import { JoinPlatformsPipe } from './pipes/join-platforms.pipe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { FormsModule } from '@angular/forms';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangeUsernameComponent } from './components/change-username/change-username.component';
import { ChangeEmailComponent } from './components/change-email/change-email.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CreateListComponent } from './components/create-list/create-list.component';
import { ListDetailsComponent } from './list-details/list-details.component';
import { UserCommentsComponent } from './components/user-comments/user-comments.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PopularGamesComponent,
    NavbarComponent,
    FooterComponent,
    GameDetailsComponent,
    JoinGenresPipe,
    JoinPlatformsPipe,
    SafeUrlPipe,
    SearchResultsComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    ChangeUsernameComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    CreateListComponent,
    ListDetailsComponent,
    UserCommentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
