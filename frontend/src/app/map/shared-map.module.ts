import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DetailsLinkComponent } from './components/details-link/details-link.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DetailsLinkComponent],
  imports: [MatIconModule, CommonModule, SharedModule],
  exports: [DetailsLinkComponent, SharedModule, MatIconModule]
})
export class SharedMapModule {}
