import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedMapLayoutComponent } from './embedded-map-layout.component';

describe('EmbeddedMapLayoutComponent', () => {
  let component: EmbeddedMapLayoutComponent;
  let fixture: ComponentFixture<EmbeddedMapLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmbeddedMapLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmbeddedMapLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
