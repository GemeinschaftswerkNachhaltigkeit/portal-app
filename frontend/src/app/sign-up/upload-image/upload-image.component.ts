/*  eslint-disable  @typescript-eslint/no-explicit-any */
/*  eslint-disable  @typescript-eslint/no-unused-vars */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropzoneService } from '../services/dropzone.service';
@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent {
  @Input() orgId = '';
  @Input() activityWipId: string | null = null;
  @Input() type: 'logo' | 'image' | 'contact' = 'logo';
  @Input() disabled = false;
  @Input() fileList: string[] = []; //UploadDocument[] = [];
  @Input() labelTranslationKey = '';
  @Input() fileId: string | undefined;
  @Input() imageFillType?: 'contain' | 'cover' = 'cover';
  @Input() imageSizeTranslationKey = '';

  @Output() delete = new EventEmitter();

  dropzone: any;

  error: any;
  constructor(public dropzoneService: DropzoneService) {}

  onDropZoneInit(event: any) {
    this.dropzone = event;
  }

  onUploadProgress(dataArray: any) {
    // this.loadingService.start('rcp-send-upload-data-request');
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

  getConfig() {
    if (this.activityWipId) {
      if (this.type === 'logo')
        return this.dropzoneService.getUploadConfigActivityLogo(
          this.orgId,
          this.activityWipId
        );
      if (this.type === 'image')
        return this.dropzoneService.getUploadConfigActivityImage(
          this.orgId,
          this.activityWipId
        );
      if (this.type == 'contact')
        return this.dropzoneService.getUploadConfigActivityContact(
          this.orgId,
          this.activityWipId
        );
      else {
        return undefined;
      }
    } else {
      if (this.type === 'logo')
        return this.dropzoneService.getUploadConfigLogo(this.orgId);
      if (this.type === 'image')
        return this.dropzoneService.getUploadConfigImage(this.orgId);
      if (this.type == 'contact')
        return this.dropzoneService.getUploadConfigContact(this.orgId);
      else {
        return undefined;
      }
    }
  }
}
