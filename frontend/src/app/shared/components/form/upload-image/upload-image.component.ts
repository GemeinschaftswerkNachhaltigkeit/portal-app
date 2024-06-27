/*  eslint-disable  @typescript-eslint/no-explicit-any */
/*  eslint-disable  @typescript-eslint/no-unused-vars */

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DropzoneService } from '../../../services/dropzone.service';

export type ImageMode = 'cover' | 'contain';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit, OnChanges {
  @Input() disabled = false;
  @Input() labelTranslationKey = '';
  @Input() fileId: string | undefined;
  @Input() imageFillType?: 'contain' | 'cover' = 'cover';
  @Input() config?: DropzoneConfigInterface & { disablePreviews?: boolean };
  @Input() aspectRatio?: string = 'auto';
  @Input() info?: string = '';
  @Input() errorMsg?: string = '';
  @Input() token?: string = '';
  @Input() imageTools? = false;
  @Input() imageMode?: ImageMode = 'cover';

  @Output() delete = new EventEmitter();
  @Output() imageModeChanged = new EventEmitter<ImageMode>();

  configuration:
    | (DropzoneConfigInterface & { disablePreviews?: boolean })
    | null = null;
  dropzone: any;

  error: any;
  constructor(public dropzoneService: DropzoneService) {}
  ngOnInit(): void {
    this.configuration = { ...this.config };
  }

  ngOnChanges(): void {
    if (this.token) {
      this.configuration = {
        ...this.config,
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      };
    } else {
      this.configuration = {
        ...this.config
      };
    }
  }

  setImageMode(imageMode: 'cover' | 'contain') {
    this.imageMode = imageMode;
    this.imageModeChanged.emit(imageMode);
  }

  onDropZoneInit(event: any) {
    this.dropzone = event;
  }

  onUploadSuccess(dataArray: any, self = this) {
    this.fileId = dataArray[1].filename;
    this.error = null;
  }

  onUploadError(dataArray: any, self = this) {
    this.error = true;
  }

  deleteHandler(): void {
    this.fileId = '';
    this.delete.emit();
  }
}
