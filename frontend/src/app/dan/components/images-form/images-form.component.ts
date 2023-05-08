import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output() deleteImage = new EventEmitter<ImageType>();

  imageTypes = ImageType;
  image = Image;

  constructor(public dzService: DropzoneService) {}

  deleteImageHandler(imageType: ImageType) {
    this.deleteImage.emit(imageType);
  }
}
