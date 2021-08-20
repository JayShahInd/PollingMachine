import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PollCreateComponent } from './poll-create/poll-create.component';
import { PollViewComponent } from './poll-view/poll-view.component';
import { PollAnalyticsComponent } from './poll-analytics/poll-analytics.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/modules/material.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    PollCreateComponent,
    PollViewComponent,
    PollAnalyticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,      
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
