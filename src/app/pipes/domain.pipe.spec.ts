import { DomainPipe } from './domain.pipe';

describe('DomainPipe', () => {
  const pipe = new DomainPipe();

  it('should extract domain from email', () => {
    expect(pipe.transform('user@example.com')).toBe('example.com');
    expect(pipe.transform('foo@bar.co')).toBe('bar.co');
  });

  it('should return empty string for invalid email', () => {
    expect(pipe.transform('notanemail')).toBe('');
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as any)).toBe('');
  });
});
