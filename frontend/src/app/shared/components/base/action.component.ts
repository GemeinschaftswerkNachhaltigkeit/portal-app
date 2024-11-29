import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { OutlinedIconComponent } from './outlined-icon.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-action',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    OutlinedIconComponent,
    MatTooltipModule
  ],
  template: `
    <ng-container *ngIf="!onlyIcon && !stroked">
      <button mat-button (click)="clickHandler()" color="accent">
        <div class="action" [ngClass]="{ small: small }">
          <app-outlined-icon *ngIf="icon">{{ icon }}</app-outlined-icon>
          <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
        </div>
      </button>
    </ng-container>
    <ng-container *ngIf="!onlyIcon && stroked">
      <button mat-stroked-button (click)="clickHandler()" color="accent">
        <div class="action" [ngClass]="{ small: small }">
          <app-outlined-icon *ngIf="icon">{{ icon }}</app-outlined-icon>
          <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
        </div>
      </button>
    </ng-container>
    <ng-container *ngIf="onlyIcon">
      <button
        [matTooltip]="tooltip"
        mat-icon-button
        (click)="clickHandler()"
        [color]="getColor()"
        [ngClass]="{ small: small, disabled: disabled, toggle: toggle }"
      >
        <app-outlined-icon *ngIf="icon">{{ icon }}</app-outlined-icon>
      </button>
    </ng-container>
    <ng-template #contentTpl><ng-content></ng-content></ng-template>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    @use '@angular/material' as mat;

    $text-color: mat.m2-get-color-from-palette($wpgwn-app-primary, 500);

    :host(.full) {
      width: 100%;
      button {
        width: 100%;
        justify-content: center;
      }
    }

    .action {
      width: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: $spacing-2;
      text-transform: uppercase;

      &.small {
        height: 28px;
      }
    }
    .disabled {
      opacity: 0.5;
    }
  `
})
export class ActionComponent implements OnInit {
  @Input() icon = '';
  @Input() full = false;
  @Input() color?: 'primary' | 'accent' | 'green' | 'bordeauxe' | 'yellow' =
    'accent';
  @Input() clickable? = false;
  @Input() disabled? = false;
  @Input() stroked? = false;
  @Input() onlyIcon? = false;
  @Input() small? = false;
  @Input() toggle? = false;
  @Input() toggleValue? = false;
  @Input() tooltip = '';
  @Output() clicked = new EventEmitter();
  @HostBinding('class.full') isFull = false;

  clickHandler(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }

  getColor(): string {
    if (this.toggle) {
      return this.toggleValue ? 'accent' : 'default';
    } else {
      return 'accent';
    }
  }

  ngOnInit(): void {
    this.isFull = this.full;
  }
}
