import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './containers/calendar/calendar.component';
import { EventsRoutingModule } from './events-routing.module';
import { CalendarLayoutComponent } from './components/calendar-layout/calendar-layout.component';
import { SharedModule } from '../shared/shared.module';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchControlsComponent } from './components/search-input/search-controls.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarLayoutComponent,
    SearchBarComponent,
    SearchControlsComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    MatIconModule,
    ReactiveFormsModule,
    MatLegacyInputModule,
    MatLegacyButtonModule
  ]
})
export class EventsModule {}
