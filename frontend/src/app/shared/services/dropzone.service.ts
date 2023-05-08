/*  eslint-disable  @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from 'src/environments/environment';
import { MimeTypeEnum } from '../models/mimetype';

@Injectable({
  providedIn: 'root'
})
export class DropzoneService {
  baseConfig: DropzoneConfigInterface | { disablePreviews?: boolean } = {
    clickable: true,
    maxFiles: 1,
    autoReset: 1,
    errorReset: 1,
    cancelReset: null,
    // url: 'http://localhost:8081/api/v1/register-organisation/e5f60695-5b51-4777-9a3d-22b524c77a25/logo',
    method: 'put',
    disablePreviews: true,
    maxFilesize: 1048576,
    acceptedFiles: [MimeTypeEnum.Image_Jpeg, MimeTypeEnum.Image_Png].join(',')
  };

  getAspectRatio(img: 'logo' | 'banner' | 'contact' | 'marketplace'): string {
    const aspectRations = {
      logo: '1/1',
      banner: '473 / 116',
      contact: '1/1',
      marketplace: '616 / 216'
    };
    return aspectRations[img];
  }

  getImageConfig(
    type: 'logo' | 'image' | 'contact',
    orgId: string,
    activityWipId?: string
  ): DropzoneConfigInterface | undefined {
    if (activityWipId) {
      if (type === 'logo')
        return this.getUploadConfigActivityLogo(orgId, activityWipId);
      if (type === 'image')
        return this.getUploadConfigActivityImage(orgId, activityWipId);
      if (type == 'contact')
        return this.getUploadConfigActivityContact(orgId, activityWipId);
      else {
        return undefined;
      }
    } else {
      if (type === 'logo') return this.getUploadConfigLogo(orgId);
      if (type === 'image') return this.getUploadConfigImage(orgId);
      if (type == 'contact') return this.getUploadConfigContact(orgId);
      else {
        return undefined;
      }
    }
  }

  getUploadConfigOrg(
    uploadType: 'logo' | 'image' | 'contact/image',
    id: string
  ): DropzoneConfigInterface {
    return {
      ...this.baseConfig,
      url: `${environment.apiUrl}/register-organisation/${id}/${uploadType}`
    };
  }

  getUploadConfigActivity(
    uploadType: 'logo' | 'image' | 'contact/image',
    orgId: string,
    randomUniqueId: string
  ): DropzoneConfigInterface {
    return {
      ...this.baseConfig,
      url: `${environment.apiUrl}/organisations/${orgId}/activities-wip/${randomUniqueId}/${uploadType}`
    };
  }

  getUploadConfigContact(
    randomUniqueId: string
  ): DropzoneConfigInterface | undefined {
    if (randomUniqueId) {
      return this.getUploadConfigOrg('contact/image', randomUniqueId);
    } else {
      return undefined;
    }
  }

  getUploadConfigActivityContact(
    orgId: string,
    randomUniqueId: string
  ): DropzoneConfigInterface | undefined {
    if (randomUniqueId) {
      return this.getUploadConfigActivity(
        'contact/image',
        orgId,
        randomUniqueId
      );
    } else {
      return undefined;
    }
  }

  getUploadConfigLogo(
    randomUniqueId?: string
  ): DropzoneConfigInterface | undefined {
    if (randomUniqueId) {
      return this.getUploadConfigOrg('logo', randomUniqueId);
    } else {
      return undefined;
    }
  }

  getUploadConfigActivityLogo(
    orgId: string,
    randomUniqueId: string
  ): DropzoneConfigInterface | undefined {
    if (randomUniqueId) {
      return this.getUploadConfigActivity('logo', orgId, randomUniqueId);
    } else {
      return undefined;
    }
  }

  getUploadConfigImage(orgId?: string): DropzoneConfigInterface | undefined {
    if (orgId) {
      return this.getUploadConfigOrg('image', orgId);
    } else {
      return undefined;
    }
  }

  getUploadConfigActivityImage(
    orgId: string,
    randomUniqueId: string
  ): DropzoneConfigInterface | undefined {
    if (orgId) {
      return this.getUploadConfigActivity('image', orgId, randomUniqueId);
    } else {
      return undefined;
    }
  }

  getFileUrl(fileId: string): string {
    return `${environment.apiUrl}/files/${fileId}`;
  }
}
