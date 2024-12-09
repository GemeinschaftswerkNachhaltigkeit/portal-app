import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgasContainerComponent } from './containers/orgas-container/orgas-container.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersComponent } from '../components/filters/filters.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AlertComponent } from 'src/app/shared/components/base/alert.component';
import { CardListComponent } from 'src/app/shared/components/cards/card-list.component';
import { BaseCardComponent } from 'src/app/shared/components/cards/base-card/base-card.component';
import { HeaderComponent } from 'src/app/shared/components/layout/header.component';
import { ContentWrapperComponent } from 'src/app/shared/components/layout/content-wrapper.component';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
import { OrganisationsRoutingModule } from './organisations-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [OrgasContainerComponent, FiltersComponent],
  imports: [
    CommonModule,
    OrganisationsRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule,
    AlertComponent,
    CardListComponent,
    BaseCardComponent,
    ContentWrapperComponent,
    HeaderComponent,
    SpinnerComponent,
    TranslateModule
  ]
})
export class OrganisationsModule {}
