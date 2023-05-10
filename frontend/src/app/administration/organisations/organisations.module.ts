import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgasContainerComponent } from './containers/orgas-container/orgas-container.component';
import { OrganisationsRoutingModule } from './organisations-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { FiltersComponent } from '../components/filters/filters.component';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';

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
