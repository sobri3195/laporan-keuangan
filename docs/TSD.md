# Technical Solution Design

## Frontend Architecture
- `app/`: router, route guards.
- `components/`: layout + reusable UI/chart/table.
- `features/`: api per domain (auth/master/report).
- `lib/`: constants, formatter, calculations.
- `schemas/`: Zod validation.
- `store/`: Zustand auth state.

## Backend Apps Script Modules
- `main.gs`: doGet/doPost entrypoint.
- `router.gs`: route mapping.
- `auth.gs`: login/session.
- `sheetService.gs`: spreadsheet adapter.
- Service modules per domain: hospital/period/report/dashboard/monitoring/audit/notification.

## Data Quality
- completeness_score, validity_score, anomaly_flags.
- warning: pengeluaran > pendapatan, ekuitas < 0, nilai ekstrem, perubahan drastis.
- duplicate prevention di kombinasi hospital_id + period_id + entity_type.
