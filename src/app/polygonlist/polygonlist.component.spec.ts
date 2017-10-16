import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonlistComponent } from './polygonlist.component';

describe('PolygonlistComponent', () => {
  let component: PolygonlistComponent;
  let fixture: ComponentFixture<PolygonlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolygonlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
