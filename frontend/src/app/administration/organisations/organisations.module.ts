import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgasContainerComponent } from './containers/orgas-container/orgas-container.component';
import { OrganisationsRoutingModule } from './organisations-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersComponent } from '../components/filters/filters.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [OrgasContainerComponent, FiltersComponent],
  imports: [
    CommonModule,
    OrganisationsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatButtonModule,
    MatMenuModule
  ]
})
export class OrganisationsModule {}
