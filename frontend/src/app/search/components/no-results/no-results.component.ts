import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-no-results',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './no-results.component.html',
  styleUrl: './no-results.component.scss'
})
export class NoResultsComponent {}
