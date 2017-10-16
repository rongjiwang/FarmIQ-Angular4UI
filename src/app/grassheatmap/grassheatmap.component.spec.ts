import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrassheatmapComponent } from './grassheatmap.component';

describe('GrassheatmapComponent', () => {
  let component: GrassheatmapComponent;
  let fixture: ComponentFixture<GrassheatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrassheatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrassheatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
