import { Component, Input } from '@angular/core';
import { SocialMediaContact } from '../../models/social-media-contact';

@Component({
  selector: 'app-social-media-links',
  templateUrl: './social-media-links.component.html',
  styleUrls: ['./social-media-links.component.scss']
})
export class SocialMediaLinksComponent {
  @Input() socialMediaLinks: SocialMediaContact[] = [];
}
