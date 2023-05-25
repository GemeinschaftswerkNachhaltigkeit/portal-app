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
import { EventComponent } from './components/event/event.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarLayoutComponent,
    SearchBarComponent,
    SearchControlsComponent,
    EventComponent,
    EventListComponent,
    FilterSidebarComponent
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
