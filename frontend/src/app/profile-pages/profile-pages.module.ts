import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLayoutComponent } from './components/profile-layout/profile-layout.component';
import { SharedModule } from '../shared/shared.module';
import { HeroComponent } from './components/hero/hero.component';
import { SectionComponent } from './components/section/section.component';
import { ContactComponent } from './components/contact/contact.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HeadingComponent } from '../shared/standalone/base/heading.component';
import { ExpiredBadgeComponent } from '../shared/standalone/base/badges/expired-badge.component';

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
    SharedModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    HeadingComponent,
    ExpiredBadgeComponent
  ]
})
export class ProfilePagesModule {}
