
# Angular User Management Portal

## Introduction
This is a modern Angular standalone application for managing users, built with Tailwind CSS and Angular v20+. It demonstrates:
- Standalone components, signals, computed, and effects
- Modern UI/UX with Tailwind and Angular Material
- Toast notifications, confirmation dialogs, and robust feedback
- API integration (JSONPlaceholder) and local mock data
- Routing, pagination, search, and theme toggle
- Unit tests for custom pipe, directive, and service




## Installation & Setup

1. **Clone the repository:**
  ```bash
  git clone https://github.com/harikrishna-gouramoni/angular-user-management-portal.git
  cd angular-user-management-portal
  ```
2. **Install dependencies:**
  ```bash
  npm install
  ```
3. **Run the application:**
  ```bash
  npm start
  # or
  ng serve
  ```
4. **Open in browser:**
  Visit [http://localhost:4200](http://localhost:4200)

## Test Endpoints / API

- **Default API:** [https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)
- **Mock Data:** `src/assets/users.json` (used if you call `fetchUsers(true)`)

## Running Unit Tests

Run all unit tests with:
```bash
ng test --watch=false
```
Tests are written for:
- `src/app/pipes/domain.pipe.spec.ts` (custom pipe)
- `src/app/services/user.service.spec.ts` (service)
- `src/app/directives/highlight.directive.spec.ts` (directive)

> **Note:** For best results, use Node.js LTS (v20.x or v18.x). Some Angular/Zone.js testbed issues may occur on non-LTS Node.js versions.


### Switching Data Source
- By default, the app uses the **JSONPlaceholder** API for users.
- To use local mock data, change `fetchUsers(false)` to `fetchUsers(true)` in:
  - `user-list.component.ts`, `user-details.component.ts`


## Application Routes
- `/users` — List, search, pagination, delete users
- `/add` — Create user
- `/edit/:id` — Edit user
- `/details/:id` — User profile


## Key Files & Features
- `src/app/services/user.service.ts` — Signals, computed, pagination, retry, error handling
- `src/app/components/user-list/user-list.component.ts` — Search, pagination, highlight directive
- `src/app/components/user-form/user-form.component.ts` — Reactive form, validation, add/edit logic
- `src/app/components/user-details/user-details.component.ts` — Route param usage, user details
- `src/app/directives/highlight.directive.ts` — Custom attribute directive
- `src/app/pipes/domain.pipe.ts` — Custom pipe for extracting email domain
- `src/styles.scss` — Tailwind, dark/light theme, UI primitives
```


## Features
- Modern Angular standalone architecture (v20+)
- Tailwind CSS and Angular Material UI
- Toast notifications, confirmation dialogs, robust feedback
- API and mock data support
- Routing, pagination, search, theme toggle
- Unit tests for pipe, directive, and service

---
© 2025 harikrishna-gouramoni
```

 
