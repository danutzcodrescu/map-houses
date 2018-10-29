import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedHouseComponent } from './selected-house.component';

describe('SelectedHouseComponent', () => {
  let component: SelectedHouseComponent;
  let fixture: ComponentFixture<SelectedHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
