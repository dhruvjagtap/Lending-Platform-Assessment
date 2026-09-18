# Lending Platform

A simple lending platform built as a full-stack application for evaluating loan applications based on loan amount, asset value, and applicant credit score.

The application calculates the applicant's Loan-to-Value (LTV), applies the required lending rules, stores the application result, and provides a small dashboard showing overall application statistics.

The project was built as part of an engineering technical assessment.

---

## Overview

The platform accepts three inputs for a loan application:

- Loan amount
- Asset value the loan is secured against
- Applicant credit score

Based on these values, the system calculates the LTV and determines whether the application should be **Successful** or **Declined**.

The application also keeps track of previously submitted applications and provides statistics such as:

- Total number of applications
- Number of successful applications
- Number of declined applications
- Total value of successful loans written
- Mean LTV across all applications

The project is split into two separate applications:

- `backend` - ASP.NET Core Web API
- `frontend` - React + TypeScript application

PostgreSQL is used for persistence.

---

## Tech Stack

### Backend

- C#
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- REST APIs
- Swagger / OpenAPI

### Frontend

- React
- TypeScript
- Vite
- CSS

### Development / Testing

- Git
- Postman
- Entity Framework Core Migrations

---

## Project Structure

```text
.
├── backend
│   ├── Controllers
│   │   ├── ApplicationController.cs
│   │   └── StatisticsController.cs
│   ├── Data
│   │   └── AppDbContext.cs
│   ├── DTOs
│   │   ├── DashboardResponse.cs
│   │   └── StatisticsResponse.cs
│   ├── Migrations
│   ├── Models
│   │   └── LoanApplication.cs
│   ├── Services
│   │   ├── LoanApplicationService.cs
│   │   ├── LoanDecisionService.cs
│   │   └── StatisticsService.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── backend.csproj
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── ApplicationList.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── LoanForm.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── Statistics.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── Lending Platform.postman_collection.json
└── README.md
```

---

## Business Rules

The loan decision is based on the loan amount, LTV and credit score.

### General limits

Applications are declined when:

- Loan amount is below £100,000
- Loan amount is above £1,500,000

### Loans of £1,000,000 or more

Both conditions must be satisfied:

- LTV must be **60% or less**
- Credit score must be **950 or higher**

### Loans below £1,000,000

The following rules are applied based on LTV:

| LTV                  | Required Credit Score |
| -------------------- | --------------------: |
| Less than 60%        |                  750+ |
| 60% to less than 80% |                  800+ |
| 80% to less than 90% |                  900+ |
| 90% or more          |              Declined |

LTV is calculated as:

```text
LTV = (Loan Amount / Asset Value) × 100
```

The decision logic is kept separately from the application and persistence logic so that the lending rules can be changed without having to modify the database or API layer.

---

## Backend Design

The backend follows a simple layered structure.

### Controllers

Controllers are responsible for handling HTTP requests and returning API responses.

- `ApplicationController` handles loan applications.
- `StatisticsController` handles dashboard/statistics requests.

### Services

Business logic is kept in services instead of putting it directly inside controllers.

- `LoanDecisionService` contains the loan eligibility rules.
- `LoanApplicationService` handles application processing and persistence.
- `StatisticsService` calculates application statistics.

### Data

`AppDbContext` is the Entity Framework Core database context used to communicate with PostgreSQL.

### Models

`LoanApplication` represents a loan application stored in the database.

### DTOs

DTOs are used for API responses instead of exposing database models directly.

This keeps the API contract separate from the persistence model.

---

## API

The backend exposes endpoints for submitting applications and retrieving statistics.

The exact endpoints and request bodies can also be tested using the included Postman collection:

```text
Lending Platform.postman_collection.json
```

The API can also be explored through Swagger when running the backend locally.

### Example application request

```json
{
  "loanAmount": 500000,
  "assetValue": 800000,
  "creditScore": 820
}
```

The backend calculates:

```text
LTV = 500000 / 800000 × 100
    = 62.5%
```

The application is then evaluated against the corresponding lending rule.

---

# Running the Project

## Prerequisites

Make sure the following are installed:

- .NET SDK
- Node.js and npm
- PostgreSQL
- Git

---

## 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

---

## 2. Set up PostgreSQL

Create a PostgreSQL database named:

```text
lending_platform
```

Then configure the connection string in:

```text
backend/appsettings.json
```

For example:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=lending_platform;Username=postgres;Password=1234"
}
```

It is recommended to use an environment variable rather than committing real database credentials to the repository.

---

## 3. Run the Backend

Navigate to the backend directory:

```bash
cd backend
```

### Configure PostgreSQL

The application uses PostgreSQL with Entity Framework Core.

Create a PostgreSQL database named:

```text
lending_platform
```

Then configure the database connection.

You can add the connection string to:

```text
backend/appsettings.json
```

For example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=lending_platform;Username=postgres;Password=your_password"
  }
}
```

For local development, the connection string can also be supplied using an environment variable.

### macOS / Linux

```bash
export ConnectionStrings__DefaultConnection="Host=localhost;Port=5432;Database=lending_platform;Username=postgres;Password=your_password"
```

For Windows, the equivalent environment-variable configuration can be set using PowerShell or the Windows environment settings.

### Restore dependencies

```bash
dotnet restore
```

### Apply database migrations

The repository already contains the Entity Framework Core migrations.

Run:

```bash
dotnet ef database update
```

This creates/updates the required database schema.

If the `dotnet ef` command is not available, install the Entity Framework Core CLI tool:

```bash
dotnet tool install --global dotnet-ef
```

### Start the API

```bash
dotnet run
```

The API will start on the configured ASP.NET Core development URL.

The exact URL can also be checked in:

```text
backend/Properties/launchSettings.json
```

Once the backend is running, the API can be accessed by the React frontend or tested independently using the included Postman collection.

---

## 4. Run the Frontend

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5019/api
```

Start the development server:

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal.

Open that URL in a browser.

---

## 5. Testing with Postman

A Postman collection is included in the root directory:

```text
Lending Platform.postman_collection.json
```

It can be imported directly into Postman to test the backend API without using the React frontend.

This is useful for testing the business logic and API responses independently of the UI.

---

# Frontend

The frontend provides a simple interface for submitting loan applications and viewing the results.

The main components are:

- `LoanForm` - accepts loan amount, asset value and credit score.
- `ApplicationList` - displays submitted applications.
- `Statistics` - displays application statistics.
- `StatCard` - reusable component for displaying individual statistics.
- `Header` - application header/navigation area.

The frontend communicates with the backend through the REST API.

---

# Statistics

The dashboard provides an overview of the applications stored in the system.

The statistics include:

### Total Applications

Number of loan applications submitted.

### Successful Applications

Number of applications that passed the lending rules.

### Declined Applications

Number of applications that did not satisfy the lending rules.

### Total Loan Value

Total value of loans that were successfully written.

### Mean LTV

Average LTV across all submitted applications.

The statistics are calculated from the stored applications rather than maintained as separate counters. This keeps the database as the source of truth and avoids having to synchronise multiple pieces of state.

---

# Design Decisions

A few implementation decisions were made to keep the project relatively simple while still separating responsibilities.

### Business logic is separated from controllers

The loan rules are implemented in `LoanDecisionService` rather than directly inside the controller.

This makes the rules easier to read, test and modify.

### Database persistence

Applications are persisted using Entity Framework Core and PostgreSQL rather than keeping them only in application memory.

This allows the statistics and application history to survive application restarts.

### DTOs

DTOs are used for responses so that the API does not need to expose the database entity directly.

### React component structure

The frontend is split into smaller components rather than keeping the entire dashboard in a single component.

This makes individual parts of the UI easier to change.

---

# Assumptions

A few assumptions were made while implementing the assessment:

- An application is stored regardless of whether the final decision is successful or declined.
- Total loan value refers to successfully written loans rather than the sum of all submitted loan amounts.
- Mean LTV is calculated across all applications.
- Credit score is expected to be between 1 and 999.
- Loan amount and asset value are monetary values in GBP.
- The asset value must be greater than zero to calculate LTV.
- The frontend is intended for local development and demonstration rather than production deployment.

---

# Possible Improvements for a Production Version

This project is intentionally scoped to the requirements of the assessment. If this were developed further, some areas I would consider improving are:

- Add automated unit tests covering the lending rules, especially boundary cases around 60%, 80%, 90%, and £1 million.
- Add request validation and more detailed API error responses.
- Add authentication and authorisation for different types of users.
- Move configuration and secrets completely out of source-controlled configuration files.
- Add structured logging for easier debugging and monitoring.
- Add database indexes where required as the application grows.
- Add pagination for application history.
- Improve financial calculations by using appropriate decimal handling and validation for monetary values.
- Make the frontend fully responsive across desktop, tablet, and mobile screen sizes.
- Add production monitoring, health checks, and application metrics.
- Consider using WebSockets or another real-time communication mechanism to immediately update statistics when a new application is submitted. This could be useful when multiple users are viewing the dashboard at the same time. For a smaller application, regular API refreshes may be simpler and more cost-effective, so the additional infrastructure would need to be justified by the actual usage requirements.

---

# Screenshots

Screenshots of the frontend are included in the project files.

The main UI includes:

- Loan application form
- Application results/history
- Statistics dashboard

Screenshots can be found under the frontend [screenshot](frontend/screenshots) directory.

---

# AI Usage

AI tools were used during development as an engineering aid, particularly for exploring implementation approaches, debugging, and reviewing parts of the code.

The AI was not treated as the source of truth for the business requirements. The lending rules were checked against the assessment specification and the generated suggestions were reviewed and modified where necessary.

A separate AI log is included with the submission containing the main prompts used, iterations, and examples of suggestions that were reviewed or corrected.

---

# Notes

This project is intended to demonstrate:

- Understanding of the provided lending rules
- Backend API development
- Business-logic separation
- Database integration
- Frontend development
- API integration
- Basic application architecture
- Ability to use AI tools while reviewing and validating their output

The implementation is intentionally kept relatively small and focused on the requirements of the technical assessment rather than trying to build a complete production lending system.
