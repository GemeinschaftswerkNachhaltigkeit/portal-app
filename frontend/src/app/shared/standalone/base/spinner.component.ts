import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="spinner"
      *ngIf="loading$ && (loading$ | async)"
      [ngClass]="{
        small: small,
        miniFixed: miniSpinnerInTopRightCorner,
        noPadding: noPadding,
        noHeight: noHeight
      }"
    >
      <h3 class="title" *ngIf="title">{{ title }}</h3>
      <div class="shapes"></div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    @use '@angular/material' as mat;

    :host {
      width: 100%;
      height: 100%;
    }

    .spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: $spacing-20;
      height: 100%;

      &.noHeight {
        height: auto;
      }

      &.noPadding {
        padding: 0;
      }

      .shapes {
        width: 5rem;
        height: 5rem;
        border-radius: 50%;
        background: $magenta;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        animation-name: loading;
        animation-duration: 2.4s;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.3, 1, 0, 1);
      }

      &.small {
        .shapes {
          width: 3rem;
          height: 3rem;
        }
      }

      &.miniFixed {
        position: fixed;
        top: calc($top-nav-height + $spacing-4);
        right: $spacing-4;
        z-index: $z9;
        width: fit-content;
        height: fit-content;
        padding: 0;
        .shapes {
          width: 3rem;
          height: 3rem;
        }
      }

      @keyframes loading {
        33% {
          opacity: 1;
          border-radius: 0;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          background: $yellow;
        }

        66% {
          border-radius: 0;
          clip-path: polygon(50% 0, 50% 0, 100% 100%, 0 100%);
          background: $blue-navy;
        }
      }
    }
  `
})
export class SpinnerComponent implements OnInit {
  @Input() forId?: string;
  @Input() title? = '';
  @Input() small? = false;
  @Input() noPadding? = false;
  @Input() noHeight? = false;
  @Input() miniSpinnerInTopRightCorner? = false;
  loading$?: Observable<boolean>;

  constructor(private loading: LoadingService) {}

  ngOnInit(): void {
    this.loading$ = this.loading.isLoading$(this.forId);
  }
}
