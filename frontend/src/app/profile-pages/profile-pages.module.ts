import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLayoutComponent } from './components/profile-layout/profile-layout.component';
import { HeroComponent } from './components/hero/hero.component';
import { SectionComponent } from './components/section/section.component';
import { ContactComponent } from './components/contact/contact.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HeadingComponent } from '../shared/components/base/heading.component';
import { ExpiredBadgeComponent } from '../shared/components/base/badges/expired-badge.component';
import { OutlinedIconComponent } from '../shared/components/base/outlined-icon.component';
import { CardLabelComponent } from '../shared/components/cards/card-label.component';
import { CardLogoComponent } from '../shared/components/cards/card-logo.component';
import { ImageComponent } from '../shared/components/base/image.component';
import { ContentWrapperComponent } from '../shared/components/layout/content-wrapper.component';
import { TopicComponent } from '../shared/components/base/topic.component';
import { SocialMediaLinksComponent } from '../shared/components/base/social-media-links/social-media-links.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProfileLayoutComponent,
    HeroComponent,
    SectionComponent,
    ContactComponent
  ],
  exports: [
    ProfileLayoutComponent,
    HeroComponent,
    SectionComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    HeadingComponent,
    ExpiredBadgeComponent,
    OutlinedIconComponent,
    CardLabelComponent,
    CardLogoComponent,
    ImageComponent,
    ContentWrapperComponent,
    TopicComponent,
    SocialMediaLinksComponent,
    TranslateModule
  ]
})
export class ProfilePagesModule {}
