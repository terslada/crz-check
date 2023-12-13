import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PohodaGridComponent } from './pohoda-grid.component';

describe('PohodaGridComponent', () => {
  let component: PohodaGridComponent;
  let fixture: ComponentFixture<PohodaGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PohodaGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PohodaGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
