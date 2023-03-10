import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyComponent } from './company/company.component';
import { SebioneApiService } from './sebione-api.service';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
;

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'company', component: CompanyComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CompanyComponent
  ],
  imports: [
    BrowserModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [SebioneApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
