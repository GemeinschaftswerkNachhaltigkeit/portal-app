import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ImageMode,
  UploadImageComponent
} from 'src/app/shared/components/form/upload-image/upload-image.component';
import { ActivityWIP } from 'src/app/shared/models/activity-wip';
import { ImageType } from 'src/app/shared/models/image-type';
import { DropzoneService } from 'src/app/shared/services/dropzone.service';

@Component({
  selector: 'app-images-form',
  standalone: true,
  imports: [CommonModule, UploadImageComponent, TranslateModule],
  template: `
    <div class="file-uploads" *ngIf="activity && activity.randomUniqueId">
      <app-upload-image
        [config]="
          dzService.getImageConfig('logo', orgId, activity.randomUniqueId)
        "
        [labelTranslationKey]="'forms.labels.activityLogo'"
        [fileId]="activity.logo"
        imageSizeTranslationKey="sign-up.upload.logoWidthTooltipExt"
        [aspectRatio]="dzService.getAspectRatio('logo')"
        style="width: 200px"
        [errorMsg]="'error.unknown' | translate"
        [info]="
          ('sign-up.upload.tooltip' | translate) +
          ', ' +
          ('sign-up.upload.logoWidthTooltipExt' | translate)
        "
        (delete)="deleteImageHandler(imageTypes.LOGO)"
      ></app-upload-image>

      <app-upload-image
        [imageTools]="bannerImageTools"
        [imageMode]="bannerImageMode"
        [config]="
          dzService.getImageConfig('image', orgId, activity.randomUniqueId)
        "
        [labelTranslationKey]="'forms.labels.activityImage'"
        [fileId]="activity.image"
        imageSizeTranslationKey="sign-up.upload.titleImageWidthTooltipExt"
        [aspectRatio]="dzService.getAspectRatio('banner')"
        [info]="
          ('sign-up.upload.tooltip' | translate) +
          ', ' +
          ('sign-up.upload.titleImageWidthTooltipExt' | translate)
        "
        (delete)="deleteImageHandler(imageTypes.TITLE)"
        (imageModeChanged)="imageModeHandler($event)"
      ></app-upload-image>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    form {
      display: flex;
      flex-direction: column;
      margin: 2em;
    }

    .wysiwyg-form-field {
      margin-bottom: $spacing-4;
    }

    .char-count {
      position: absolute;
      top: 4rem;
      right: 1rem;
    }

    .tip-tap-wrapper {
      position: relative;
    }

    .two-cols {
      flex-direction: column;
      display: flex;
      gap: 0;
      align-items: flex-start;
      margin-bottom: $spacing-8;
      > * {
        flex: 1 0 50%;
      }
    }

    .file-uploads {
      display: flex;
      gap: 2em;
      flex-direction: column;
      margin-bottom: $spacing-4;
    }

    @media screen and (min-width: $breakpoint-sm) {
      .file-uploads {
        flex-direction: row;
      }
      .two-cols {
        flex-direction: row;
        display: flex;
        gap: $spacing-8;
        align-items: flex-start;
        margin-bottom: 0;
      }
    }
  `
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
