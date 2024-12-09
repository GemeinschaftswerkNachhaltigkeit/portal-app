import { NgModule } from '@angular/core';
import { DetailsLinkComponent } from './components/details-link/details-link.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DetailsLinkComponent],
  imports: [MatIconModule, CommonModule],
  exports: [DetailsLinkComponent, MatIconModule]
})
export class SharedMapModule {}
