import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { MapService } from './services/map/map.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatTableModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
} from '@angular/material';
import { SelectedHouseComponent } from './components/selected-house/selected-house.component';
import { HouseTableComponent } from './components/house-table/house-table.component';
import { CommuneChartComponent } from './components/commune-chart/commune-chart.component';
import { NumberOfDaysPipe } from './pipes/number-of-days.pipe';
import { FilterPriceComponent } from './components/filter-price/filter-price.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DashboardComponent,
    SelectedHouseComponent,
    HouseTableComponent,
    CommuneChartComponent,
    NumberOfDaysPipe,
    FilterPriceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    GraphQLModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  providers: [MapService, LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
