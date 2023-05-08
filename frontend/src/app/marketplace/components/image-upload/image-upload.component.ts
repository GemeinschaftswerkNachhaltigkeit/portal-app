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

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
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
