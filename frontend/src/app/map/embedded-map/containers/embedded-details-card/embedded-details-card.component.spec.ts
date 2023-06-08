import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedDetailsCardComponent } from './embedded-details-card.component';

describe('EmbeddedDetailsCardComponent', () => {
  let component: EmbeddedDetailsCardComponent;
  let fixture: ComponentFixture<EmbeddedDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmbeddedDetailsCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EmbeddedDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
