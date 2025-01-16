import { Component, Input, OnInit } from '@angular/core';
import { SdgsService } from 'src/app/shared/services/sdgs.service';

@Component({
  selector: 'app-sdg-icon',
  standalone: true,
  imports: [],
  template: `
    @if (goal !== undefined && goal !== null) {
      <img [src]="goalUrl" [alt]="goal" [class]="size" />
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    img {
      width: 10rem;
      height: 10rem;

      &.sm {
        width: 3rem;
        height: 3rem;
      }

      &.md {
        width: 5rem;
        height: 5rem;
      }

      &.full {
        width: 100%;
        height: 100%;
      }
    }
  `
})
export class SdgIconComponent implements OnInit {
  @Input() goal = 0;
  @Input() size: 'sm' | 'md' | 'lg' | 'full' = 'full';
  goalUrl = '';

  constructor(private sdgsService: SdgsService) {}

  ngOnInit(): void {
    this.goalUrl = this.sdgsService.getGoalIconPath(this.goal);
  }
}
