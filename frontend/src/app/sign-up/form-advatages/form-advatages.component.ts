import { Component, Input, ViewEncapsulation } from '@angular/core';
import {
  SignUpActivityContent,
  SignUpOrgContent
} from '../services/directus-content.service';

@Component({
  selector: 'app-form-advatages',
  templateUrl: './form-advatages.component.html',
  styleUrls: ['./form-advatages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormAdvantagesComponent {
  @Input() content: SignUpOrgContent | SignUpActivityContent | null = null;
}
