import { TestBed } from '@angular/core/testing';

import { TeamMembersGuard } from './team-members.guard';

describe('TeamMembersGuard', () => {
  let guard: TeamMembersGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TeamMembersGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
