# Angular 20 — User Management Portal

A complete starter showcasing:
- Standalone components, routing, `@if` / `@for`
- HttpClient service + **signals** for state (users, loading, error, pagination, query)
- Reactive Forms (add/edit) with validation
- Custom **Directive** (hover highlight) & **Pipe** (email domain)
- Debounced **search** with RxJS → signal
- Bonus: pagination, theme toggle, API retry, simple autosave effect

## Quickstart

```bash
  
npm i
npm start
# open http://localhost:4200
```

### Switching data source
- By default, components call `fetchUsers(false)` to use **JSONPlaceholder** API.
- To use local mock data instead, change to `fetchUsers(true)` in:
  - `user-list.component.ts`, `user-details.component.ts`

## Routes
- `/users` — list, search, pagination, delete
- `/add` — create user
- `/edit/:id` — edit existing
- `/details/:id` — user profile

## Files to Explore
- `src/app/services/user.service.ts` — signals, computed, pagination, retry, error
- `src/app/components/user-list/user-list.component.ts` — search debounce, `@if`/`@for`
- `src/app/components/user-form/user-form.component.ts` — reactive form + validation
- `src/app/components/user-details/user-details.component.ts` — route param usage
- `src/app/directives/highlight.directive.ts` — attribute directive
- `src/app/pipes/domain.pipe.ts` — custom pipe
- `src/styles.css` — simple light/dark and UI primitives
```

## Testing (samples left as an exercise)
Use `ng test` to run Karma/Jasmine. Suggested unit tests:
- Pipe: `domain.pipe` transforms emails correctly.
- Directive: toggles `.active` class on hover.
- Service: `filtered`/`paged` computed outputs given input signals.
```

 
