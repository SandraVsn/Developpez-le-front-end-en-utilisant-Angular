import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DetailsComponent } from './pages/details/details.component';
import { ChartModule } from 'primeng/chart';
import { ErrorComponent } from './pages/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    DetailsComponent,
    ErrorComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ChartModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
