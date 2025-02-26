/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output
} from '@angular/core';
import { MimeTypeEnum } from 'src/app/shared/models/mimetype';
import { ImgService } from 'src/app/shared/services/img.service';
import { DropzoneService } from 'src/app/shared/services/dropzone.service';
import { environment } from 'src/environments/environment';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [DropzoneModule, MatIconModule, MatButtonModule, TranslateModule],
  template: `
    @if (config) {
      <div class="upload-wrapper">
        <label>{{ 'marketplace.labels.image' | translate }}</label>
        <div class="dropzone-wrapper">
          <div class="uploaded-image">
            @if (fileId) {
              <img [src]="imgService.url(fileId)" alt="upload-image" />
            }
          </div>
          <dropzone
            [config]="config"
            [message]="'marketplace.labels.imageUpload' | translate"
            (init)="onDropZoneInit($event)"
            (success)="onUploadSuccess($event)"
            (error)="onUploadError()"
            [class]="'type'"
          >
          </dropzone>
        </div>
        <div class="actions">
          <span class="help">{{
            'marketplace.labels.imageHelp' | translate
          }}</span>
          @if (fileId) {
            <button mat-icon-button (click)="deleteHandler()">
              <mat-icon>delete</mat-icon>
            </button>
          }
        </div>
      </div>
    }

    @if (error) {
      <span class="upload-error mat-error">
        {{ 'marketplace.labels.imageError' | translate }}</span
      >
    }
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    :host {
      height: 100%;
      width: 100%;
    }

    dropzone {
      aspect-ratio: 390 / 164;
    }

    .upload-label,
    .upload-error {
      flex: 0 0 100%;
    }

    .upload-wrapper {
      aspect-ratio: 390 / 164;
      display: flex;
      flex-direction: column;
      gap: 0;
      .dropzone-wrapper {
        position: relative;
        width: inherit;
        height: inherit;
        .uploaded-image {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }

    .disabled {
      //border-color: rgba(0, 0, 0, 0.06);
      color: rgba(0, 0, 0, 0.38);
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: $spacing-2;

      .help {
        font-size: 1rem;
      }
    }
  `
})
export class ImageUploadComponent implements OnInit, OnChanges {
  @Input() endpoint!: string;
  @Input() token?: string;
  @Input() fileId: string | undefined;

  @Output() delete = new EventEmitter();

  config: any;

  dropzone: any;

  error: any;
  constructor(
    public dropzoneService: DropzoneService,
    public imgService: ImgService
  ) {}

  ngOnInit(): void {
    this.config = {
      clickable: true,
      maxFiles: 1,
      autoReset: 1,
      errorReset: 1,
      cancelReset: null,
      url: `${environment.apiUrl}/${this.endpoint}`,
      method: 'put',
      disablePreviews: true,
      maxFileSize: 1048576,
      acceptedFiles: [MimeTypeEnum.Image_Jpeg, MimeTypeEnum.Image_Png].join(
        ','
      ),
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };
  }

  ngOnChanges(): void {
    this.config = {
      ...this.config,
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };
  }

  onDropZoneInit(event: any) {
    this.dropzone = event;
  }

  onUploadSuccess(dataArray: any) {
    this.fileId = dataArray[1].filename;
    this.error = null;
  }

  onUploadError() {
    this.error = true;
  }

  deleteHandler(): void {
    this.fileId = '';
    this.delete.emit();
  }
}
