import { Component, Input, ViewEncapsulation } from '@angular/core';
import {
  DanContent,
  SignUpActivityContent,
  SignUpOrgContent
} from 'src/app/shared/services/directus-content.service';

@Component({
  selector: 'app-form-advatages',
  templateUrl: './form-advatages.component.html',
  styleUrls: ['./form-advatages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormAdvantagesComponent {
  @Input() content:
    | SignUpOrgContent
    | SignUpActivityContent
    | DanContent
    | null = null;
}
