# Tests Automatisés et Qualité du Code : Guide Complet

## Introduction

Les tests automatisés sont essentiels pour garantir la fiabilité de votre application. Dans ce tutoriel, nous allons mettre en place une stratégie de tests complète avec mesure de la qualité du code.

## Pyramide des Tests

```
       /\
      /  \     E2E (5%)
     /----\
    /      \   Intégration (15%)
   /--------\
  /          \ Unitaires (80%)
 /____________\
```

## Architecture de Test

```
Tests
├── Unitaires (Jest/Vitest)
├── Intégration (Supertest)
├── E2E (Playwright/Cypress)
├── Performance (k6)
├── Sécurité (OWASP ZAP)
└── Qualité (SonarQube)
```

## Partie 1 : Tests Unitaires avec Jest

### Installation

```bash
npm install --save-dev jest @jest/globals @types/jest
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event
```

### Configuration `jest.config.js`

```javascript
export default {
  // Environnement de test
  testEnvironment: 'jsdom',

  // Extensions de fichiers
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

  // Transformation des fichiers
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
    }],
  },

  // Patterns de fichiers de tests
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],

  // Couverture de code
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/index.tsx',
  ],

  // Seuils de couverture
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Setup des tests
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Mapping des modules
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Timeout
  testTimeout: 10000,

  // Reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './coverage',
      outputName: 'junit.xml',
    }],
  ],
};
```

### Exemple de Test Unitaire

```typescript
// src/utils/calculator.test.ts
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Calculator } from './calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  afterEach(() => {
    calculator = null;
  });

  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });

    it('should handle zero', () => {
      expect(calculator.add(0, 5)).toBe(5);
    });

    it('should handle decimal numbers', () => {
      expect(calculator.add(1.5, 2.3)).toBeCloseTo(3.8);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Division by zero');
    });

    it('should handle decimal results', () => {
      expect(calculator.divide(10, 3)).toBeCloseTo(3.333, 3);
    });
  });
});
```

### Test d'un Composant React

```typescript
// src/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading...</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-loading');
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
```

### Test d'API avec Supertest

```typescript
// src/api/users.test.ts
import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User';

describe('Users API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toMatchObject({
        email: userData.email,
        name: userData.name,
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'invalid-email',
          name: 'Test',
          password: 'Pass123!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        name: 'User',
        password: 'Pass123!',
      };

      await request(app).post('/api/users').send(userData);

      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(409);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const user = await User.create({
        email: 'test@example.com',
        name: 'Test User',
      });

      const response = await request(app)
        .get(`/api/users/${user.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/nonexistent-id')
        .expect(404);
    });
  });
});
```

## Partie 2 : Tests E2E avec Playwright

### Installation

```bash
npm init playwright@latest
```

### Configuration `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Exemple de Test E2E

```typescript
// e2e/authentication.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveTitle(/Login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('Password123!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back!')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('Password123!');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/dashboard');

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/login');
  });
});
```

### Tests avec Fixtures

```typescript
// e2e/fixtures.ts
import { test as base } from '@playwright/test';
import { UserPage } from './pages/UserPage';

type MyFixtures = {
  userPage: UserPage;
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  userPage: async ({ page }, use) => {
    const userPage = new UserPage(page);
    await use(userPage);
  },

  authenticatedPage: async ({ page }, use) => {
    // Login automatiquement
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('Password123!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('/dashboard');
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

## Partie 3 : Qualité du Code avec SonarQube

### Configuration `sonar-project.properties`

```properties
# Informations du projet
sonar.projectKey=mon-projet
sonar.projectName=Mon Projet
sonar.projectVersion=1.0.0

# Sources
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts

# Exclusions
sonar.exclusions=**/node_modules/**,**/*.spec.ts,**/*.test.ts,**/coverage/**

# Couverture de code
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.testExecutionReportPaths=test-results/sonar-report.xml

# Analyse TypeScript
sonar.typescript.tsconfigPath=tsconfig.json

# Seuils de qualité
sonar.qualitygate.wait=true
```

### Intégration CI/CD

```yaml
# .github/workflows/sonarqube.yml
name: SonarQube Analysis

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  sonarqube:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}

      - name: Quality Gate check
        uses: sonarsource/sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## Partie 4 : Tests de Performance avec k6

### Installation

```bash
# Via Homebrew (macOS)
brew install k6

# Via Docker
docker pull grafana/k6
```

### Script de Test `performance.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp-up
    { duration: '1m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 100 }, // Spike
    { duration: '1m', target: 50 },   // Back down
    { duration: '30s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% des requêtes < 500ms
    http_req_failed: ['rate<0.01'],   // Taux d'erreur < 1%
    errors: ['rate<0.1'],             // Erreurs custom < 10%
  },
};

export default function () {
  // Test Homepage
  let res = http.get('https://mon-app.com/');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  sleep(1);

  // Test API
  res = http.get('https://mon-app.com/api/users', {
    headers: {
      'Authorization': 'Bearer TOKEN',
    },
  });
  check(res, {
    'API status is 200': (r) => r.status === 200,
    'API response time < 200ms': (r) => r.timings.duration < 200,
    'has users array': (r) => JSON.parse(r.body).users !== undefined,
  }) || errorRate.add(1);

  sleep(2);
}
```

### Exécution

```bash
# Localement
k6 run performance.js

# Avec Docker
docker run -v $(pwd):/scripts grafana/k6 run /scripts/performance.js

# Avec reporting
k6 run --out json=results.json performance.js
```

## Partie 5 : Stratégie de Tests Complète

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=\\.test\\.",
    "test:integration": "jest --testPathPattern=\\.integration\\.",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:perf": "k6 run performance.js",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e",
    "sonar": "sonar-scanner",
    "quality": "npm run lint && npm run test:coverage && npm run sonar"
  }
}
```

### Pipeline CI Complet

```yaml
name: Tests & Quality

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v4

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  sonarqube:
    needs: [unit-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## Métriques de Qualité

### Objectifs à Atteindre

| Métrique | Cible | Excellent |
|----------|-------|-----------|
| Couverture de code | >80% | >90% |
| Tests unitaires | >500 | >1000 |
| Temps de build | <5min | <3min |
| Bugs critiques | 0 | 0 |
| Code smells | <100 | <50 |
| Dette technique | <5 jours | <2 jours |

## Bonnes Pratiques

### ✅ À FAIRE
- ✅ Écrire les tests AVANT le code (TDD)
- ✅ Viser 80%+ de couverture
- ✅ Tester les cas limites
- ✅ Mocker les dépendances externes
- ✅ Tests rapides (<1s par test unitaire)
- ✅ Tests déterministes (pas de random)

### ❌ À ÉVITER
- ❌ Tests qui testent l'implémentation
- ❌ Tests trop couplés au code
- ❌ Ignorer les tests qui échouent
- ❌ Tests lents (>10s)
- ❌ Pas de tests pour le code critique

## Conclusion

Une stratégie de tests solide garantit :
- ✅ Code fiable et maintenable
- ✅ Détection précoce des bugs
- ✅ Refactoring en toute confiance
- ✅ Documentation vivante
- ✅ Équipe productive

**ROI** : 10x moins de bugs en production, 5x plus rapide pour corriger

---

**Auteur** : Alice Sindayigaya - Ingénieure DevOps
**Date** : Janvier 2026
**Tags** : Tests, Qualité, Jest, Playwright, SonarQube, DevOps
