import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImgService {
  url(filename = ''): string | null {
    return filename ? `${environment.apiUrl}/files/${filename}` : null;
  }
}
