import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './containers/calendar/calendar.component';
import { EventsRoutingModule } from './events-routing.module';
import { CalendarLayoutComponent } from './components/calendar-layout/calendar-layout.component';
import { SharedModule } from '../shared/shared.module';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@NgModule({
  declarations: [CalendarComponent, CalendarLayoutComponent, SearchBarComponent],
  imports: [CommonModule, EventsRoutingModule, SharedModule]
})
export class EventsModule {}
