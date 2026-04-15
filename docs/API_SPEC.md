# API Spec

Base URL: `VITE_API_BASE_URL`

## Auth
- POST `/auth/login`
- POST `/auth/logout`
- GET `/auth/me`

## Master
- GET/POST `/hospitals`
- PUT `/hospitals/:id`
- GET/POST `/users`
- PUT `/users/:id`
- GET/POST `/periods`
- PUT `/periods/:id`

## Reports
- GET `/reports`
- GET `/reports/:id`
- POST `/reports/pnbp`
- PUT `/reports/pnbp/:id`
- POST `/reports/blu`
- PUT `/reports/blu/:id`
- POST `/reports/:id/submit`
- POST `/reports/:id/approve`
- POST `/reports/:id/request-revision`

## Dashboard & Monitoring
- GET `/dashboard/summary`
- GET `/dashboard/trends`
- GET `/dashboard/rankings`
- GET `/monitoring/compliance`

## Others
- GET `/notifications`
- POST `/notifications/:id/read`
- GET `/audit-logs`
- GET `/exports/reports`
