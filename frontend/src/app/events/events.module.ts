import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './containers/calendar/calendar.component';
import { EventsRoutingModule } from './events-routing.module';
import { CalendarLayoutComponent } from './components/calendar-layout/calendar-layout.component';
import { SharedModule } from '../shared/shared.module';
import { SearchControlsComponent } from './components/search-controls/search-controls.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EventComponent } from './components/event/event.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateSelectComponent } from './components/date-select/date-select.component';
import { DateSelectHeaderComponent } from './components/date-select-header/date-select-header.component';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarLayoutComponent,
    SearchControlsComponent,
    EventComponent,
    EventListComponent,
    FilterSidebarComponent,
    DateSelectComponent,
    DateSelectHeaderComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    FormsModule
  ]
})
export class EventsModule {}
