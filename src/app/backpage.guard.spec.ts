import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { backpageGuard } from './backpage.guard';

describe('backpageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => backpageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
