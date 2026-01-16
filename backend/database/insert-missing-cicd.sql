-- ========================================
-- AJOUTER 2 TUTORIELS CI/CD MANQUANTS
-- Pour compléter à 20 tutoriels au total
-- ========================================
-- IMPORTANT: Remplacez '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3' par votre user_id

-- CI/CD 1: Tests & Qualité Code
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'Tests Automatisés et Qualité Code : Pipeline CI/CD Complet',
    'tests-quality-cicd-pipeline',
    $BODY$# Tests Automatisés et Qualité Code

## 🎯 Use Case : 0 Bug en Production

Startup qui lance 10 déploiements/jour. Avant les tests automatisés : 1 bug majeur par semaine. Après : 0 bug depuis 6 mois.

**Pipeline complet :**
1. Unit tests (Jest, Pytest)
2. Integration tests (Supertest, TestContainers)
3. E2E tests (Playwright, Cypress)
4. Code coverage (>80% requis)
5. Linting (ESLint, Prettier, Black)
6. Security scan (Snyk, Trivy)
7. Performance tests (K6, Lighthouse)

## Architecture Pipeline

```
Git Push → Tests Unitaires → Tests Intégration → Linting → Security Scan → E2E Tests → Deploy
```

## Étape 1 : Tests Unitaires (Jest)

```javascript
// test/api.test.js
const request = require('supertest');
const app = require('../server');

describe('API Tests', () => {
    test('GET /api/users should return users list', async () => {
        const response = await request(app)
            .get('/api/users')
            .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toBeInstanceOf(Array);
    });

    test('POST /api/users should create user', async () => {
        const newUser = {
            name: 'Alice',
            email: 'alice@example.com'
        };

        const response = await request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201);

        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.email).toBe(newUser.email);
    });
});
```

## Étape 2 : GitHub Actions Pipeline

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

      - name: Security scan
        run: npm audit --audit-level=high

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  e2e:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  deploy:
    needs: [quality, e2e]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploying to production..."
```

## Étape 3 : Code Coverage (Istanbul/NYC)

```json
{
  "scripts": {
    "test:coverage": "jest --coverage --coverageReporters=text --coverageReporters=lcov",
    "test:coverage:threshold": "jest --coverage --coverageThreshold='{\"global\":{\"branches\":80,\"functions\":80,\"lines\":80,\"statements\":80}}'"
  }
}
```

## Étape 4 : E2E Tests (Playwright)

```javascript
// e2e/checkout.spec.js
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
    test('should complete purchase successfully', async ({ page }) => {
        // 1. Accéder à la page produit
        await page.goto('https://myapp.com/products/123');

        // 2. Ajouter au panier
        await page.click('[data-testid="add-to-cart"]');
        await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

        // 3. Aller au panier
        await page.click('[data-testid="cart-icon"]');
        await expect(page).toHaveURL(/.*cart/);

        // 4. Checkout
        await page.click('[data-testid="checkout-button"]');

        // 5. Remplir formulaire
        await page.fill('[name="email"]', 'test@example.com');
        await page.fill('[name="card"]', '4242424242424242');
        await page.fill('[name="expiry"]', '12/25');
        await page.fill('[name="cvc"]', '123');

        // 6. Valider commande
        await page.click('[data-testid="submit-payment"]');

        // 7. Vérifier succès
        await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
        await expect(page).toHaveURL(/.*order-confirmation/);
    });
});
```

## Étape 5 : Quality Gates (SonarQube)

```yaml
# sonar-project.properties
sonar.projectKey=my-app
sonar.organization=my-org

sonar.sources=src
sonar.tests=test
sonar.exclusions=**/*.test.js,**/node_modules/**

sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Quality Gates
sonar.qualitygate.wait=true
sonar.qualitygate.timeout=300
```

**GitHub Actions intégration :**

```yaml
- name: SonarCloud Scan
  uses: SonarSource/sonarcloud-github-action@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## Étape 6 : Performance Testing (K6)

```javascript
// performance/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 },   // Ramp-up
        { duration: '1m', target: 100 },   // Stable load
        { duration: '30s', target: 0 },    // Ramp-down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],  // 95% < 500ms
        http_req_failed: ['rate<0.01'],    // Error rate < 1%
    },
};

export default function () {
    const res = http.get('https://myapp.com/api/users');

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}
```

## ROI Réel

**Avant tests automatisés :**
- Bugs production : 4/mois
- Hotfix urgent : 2/mois
- Time to fix : 4h moyenne
- Coût downtime : 10K€/incident

**Après tests automatisés :**
- Bugs production : 0.5/mois (-87%)
- Hotfix urgent : 0/mois (-100%)
- Time to fix : 30 min (-87%)
- Coût économisé : 30K€/an

## Métriques Clés

- **Code Coverage** : >80% (lines, branches, functions)
- **Test Execution Time** : <5 min
- **Build Success Rate** : >95%
- **Mean Time to Detect (MTTD)** : <2 min
- **Mean Time to Repair (MTTR)** : <30 min$BODY$,
    'Pipeline CI/CD complet avec tests automatisés. Unit tests, integration tests, E2E, linting, security scan. 0 bug en production avec Jest, Playwright, K6.',
    '/images/tutorials/tests-quality.svg',
    'CI/CD',
    ARRAY['CI/CD', 'Testing', 'Quality', 'Jest', 'Playwright', 'GitHub Actions'],
    'published',
    NOW() - INTERVAL '35 days',
    0,
    24,
    'Tests Automatisés CI/CD : 0 Bug Production avec Jest',
    'Pipeline CI/CD complet : unit tests, E2E, linting, security. Jest, Playwright, K6, SonarQube. Quality gates et coverage >80%.',
    ARRAY['cicd', 'testing', 'quality', 'jest', 'playwright', 'automation']
);

-- CI/CD 2: Terraform + Ansible (Infrastructure Automation)
INSERT INTO blog_posts (
    user_id, title, slug, content, excerpt, cover_image, category, tags,
    status, published_at, views, read_time, seo_title, seo_description, seo_keywords
) VALUES (
    '3cd1dbe8-35c8-4eb3-8e91-6d1e899028c3',
    'CI/CD Infrastructure : Terraform + Ansible Automatisés',
    'cicd-terraform-ansible-automation',
    $BODY$# CI/CD Infrastructure avec Terraform & Ansible

## 🎯 Use Case : Infrastructure as Code Automatisée

Déployer automatiquement une infrastructure complète (VPC, DB, EC2, Config) en 15 minutes via un pipeline CI/CD.

**Workflow :**
1. Dev push code Terraform
2. GitHub Actions valide syntaxe
3. Terraform plan → Review
4. Terraform apply → Infra créée
5. Ansible configure serveurs
6. Tests d'infrastructure
7. Notification Slack

## Architecture Pipeline

```
Git Push → Terraform Validate → Terraform Plan → Approval → Terraform Apply → Ansible Playbook → Tests Infra → Slack
```

## Étape 1 : Terraform CI/CD Pipeline

```yaml
name: Infrastructure CI/CD

on:
  push:
    branches: [main]
    paths:
      - 'terraform/**'
  pull_request:
    branches: [main]
    paths:
      - 'terraform/**'

env:
  TF_VERSION: '1.6.0'
  AWS_REGION: 'eu-west-1'

jobs:
  terraform-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: ${{ env.TF_VERSION }}

      - name: Terraform Format Check
        run: terraform fmt -check -recursive
        working-directory: terraform/

      - name: Terraform Init
        run: terraform init
        working-directory: terraform/
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Terraform Validate
        run: terraform validate
        working-directory: terraform/

      - name: TFLint
        uses: terraform-linters/setup-tflint@v3
        with:
          tflint_version: latest

      - name: Run TFLint
        run: tflint --init && tflint
        working-directory: terraform/

  terraform-plan:
    needs: terraform-validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2

      - name: Terraform Init
        run: terraform init
        working-directory: terraform/
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Terraform Plan
        id: plan
        run: terraform plan -out=tfplan -no-color
        working-directory: terraform/
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Save Plan
        uses: actions/upload-artifact@v3
        with:
          name: terraform-plan
          path: terraform/tfplan

      - name: Comment PR with Plan
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const output = `#### Terraform Plan 📖
            \`\`\`
            ${{ steps.plan.outputs.stdout }}
            \`\`\`
            `;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: output
            });

  terraform-apply:
    needs: terraform-plan
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2

      - name: Download Plan
        uses: actions/download-artifact@v3
        with:
          name: terraform-plan
          path: terraform/

      - name: Terraform Init
        run: terraform init
        working-directory: terraform/
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Terraform Apply
        run: terraform apply -auto-approve tfplan
        working-directory: terraform/
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Get Outputs
        id: outputs
        run: |
          echo "instance_ip=$(terraform output -raw instance_ip)" >> $GITHUB_OUTPUT
        working-directory: terraform/

  ansible-configure:
    needs: terraform-apply
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install Ansible
        run: |
          python -m pip install --upgrade pip
          pip install ansible boto3

      - name: Run Ansible Playbook
        run: |
          ansible-playbook -i inventory/aws_ec2.yml playbooks/configure.yml
        working-directory: ansible/
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          ANSIBLE_HOST_KEY_CHECKING: False

  infrastructure-tests:
    needs: ansible-configure
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Test Infrastructure
        run: |
          # Test SSH connectivity
          ssh -o StrictHostKeyChecking=no ubuntu@${{ needs.terraform-apply.outputs.instance_ip }} "echo 'SSH OK'"

          # Test web server
          curl -f http://${{ needs.terraform-apply.outputs.instance_ip }} || exit 1

          # Test database
          nc -zv ${{ needs.terraform-apply.outputs.instance_ip }} 5432

      - name: Notify Slack
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Infrastructure deployment ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Status*: ${{ job.status }}\n*Instance IP*: ${{ needs.terraform-apply.outputs.instance_ip }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Étape 2 : Dynamic Inventory Ansible

```yaml
# ansible/inventory/aws_ec2.yml
plugin: aws_ec2
regions:
  - eu-west-1
filters:
  tag:Environment: production
  instance-state-name: running
keyed_groups:
  - key: tags.Role
    prefix: role
hostnames:
  - ip-address
compose:
  ansible_host: public_ip_address
```

## Étape 3 : Automated Rollback

```yaml
- name: Rollback on Failure
  if: failure()
  run: |
    terraform workspace select production
    terraform apply -auto-approve -var="rollback=true"
  working-directory: terraform/
```

## ROI

- **Provisioning Time** : 2 jours → 15 min (-99%)
- **Configuration Drift** : Éliminé (idempotence)
- **Human Errors** : -95%
- **Time to Recovery** : 1h → 5 min$BODY$,
    'Automatisez votre infrastructure avec Terraform et Ansible en CI/CD. Validation, plan, apply, configuration. Pipeline complet GitHub Actions. Infrastructure as Code.',
    '/images/tutorials/terraform-ansible.svg',
    'CI/CD',
    ARRAY['CI/CD', 'Terraform', 'Ansible', 'IaC', 'GitHub Actions', 'Automation'],
    'published',
    NOW() - INTERVAL '40 days',
    0,
    26,
    'CI/CD Infrastructure : Terraform + Ansible Automatisés',
    'Pipeline CI/CD complet pour Infrastructure as Code. Terraform validate, plan, apply. Ansible configuration. Tests automatisés.',
    ARRAY['cicd', 'terraform', 'ansible', 'iac', 'github actions', 'automation']
);
