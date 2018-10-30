import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommuneChartComponent } from './commune-chart.component';

describe('CommuneChartComponent', () => {
  let component: CommuneChartComponent;
  let fixture: ComponentFixture<CommuneChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommuneChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommuneChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
