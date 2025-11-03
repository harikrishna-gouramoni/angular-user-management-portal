import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

const mockUsers = [
  { id: 1, name: 'A', email: 'a@a.com', phone: '1', company: 'C1' },
  { id: 2, name: 'B', email: 'b@b.com', phone: '2', company: 'C2' }
];

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch users from API', () => {
    service.fetchUsers();
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
    expect(service.users().length).toBe(2);
    expect(service.users()[0].name).toBe('A');
  });

  it('should add a user', () => {
    service.users.set([]);
    service.add({ name: 'C', email: 'c@c.com', phone: '', company: '' });
    expect(service.users().length).toBe(1);
    expect(service.users()[0].name).toBe('C');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
