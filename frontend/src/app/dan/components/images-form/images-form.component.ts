import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageMode } from 'src/app/shared/components/form/upload-image/upload-image.component';
import { ActivityWIP } from 'src/app/shared/models/activity-wip';
import { ImageType } from 'src/app/shared/models/image-type';
import { DropzoneService } from 'src/app/shared/services/dropzone.service';

@Component({
  selector: 'app-images-form',
  templateUrl: './images-form.component.html',
  styleUrls: ['./images-form.component.scss']
})
export class ImagesFormComponent {
  @Input() activity!: ActivityWIP;
  @Input() orgId!: string;
  @Input() bannerImageTools? = false;
  @Input() bannerImageMode?: ImageMode = 'cover';

  @Output() deleteImage = new EventEmitter<ImageType>();
  @Output() imageMode = new EventEmitter<ImageMode>();

  imageTypes = ImageType;
  image = Image;

  constructor(public dzService: DropzoneService) {}

  deleteImageHandler(imageType: ImageType) {
    this.deleteImage.emit(imageType);
  }
  imageModeHandler(imageMode: ImageMode) {
    this.imageMode.emit(imageMode);
  }
}
