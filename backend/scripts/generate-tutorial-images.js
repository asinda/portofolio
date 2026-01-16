/**
 * Script pour générer des images SVG placeholder pour les tutoriels
 * Usage: node scripts/generate-tutorial-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../../frontend/public/images/tutorials');

// Configuration des images
const images = [
    { name: 'github-actions', title: 'GitHub Actions', subtitle: 'CI/CD Pipeline', gradient: ['#00a3ff', '#0066cc'] },
    { name: 'gitlab-k8s', title: 'GitLab + K8s', subtitle: 'Docker & Kubernetes', gradient: ['#fc6d26', '#e24329'] },
    { name: 'tests-quality', title: 'Tests & Quality', subtitle: 'Jest, Playwright, SonarQube', gradient: ['#15c213', '#0e8a0c'] },
    { name: 'terraform-ansible', title: 'IaC Multi-Env', subtitle: 'Terraform & Ansible', gradient: ['#7b42bc', '#5c2d91'] },

    // DevOps
    { name: 'devops-monitoring', title: 'Monitoring', subtitle: 'Prometheus & Grafana', gradient: ['#e6522c', '#ff6b35'] },
    { name: 'devops-elk', title: 'ELK Stack', subtitle: 'Logs Centralisés', gradient: ['#00bfb3', '#00a2a1'] },
    { name: 'devops-vault', title: 'HashiCorp Vault', subtitle: 'Secrets Management', gradient: ['#ffd814', '#ffb81c'] },
    { name: 'devops-argocd', title: 'ArgoCD', subtitle: 'GitOps Kubernetes', gradient: ['#ef7b4d', '#f25022'] },

    // Cloud
    { name: 'cloud-aws', title: 'AWS', subtitle: '3-Tier Architecture', gradient: ['#ff9900', '#ec7211'] },
    { name: 'cloud-azure', title: 'Azure', subtitle: 'AKS & DevOps', gradient: ['#0078d4', '#005a9e'] },
    { name: 'cloud-gcp', title: 'GCP', subtitle: 'Cloud Run Serverless', gradient: ['#4285f4', '#1a73e8'] },
    { name: 'cloud-multicloud', title: 'Multi-Cloud', subtitle: 'AWS + Azure + GCP', gradient: ['#667eea', '#764ba2'] },
    { name: 'cloud-aws-lambda', title: 'AWS Lambda', subtitle: 'Serverless Functions', gradient: ['#ff9900', '#ec7211'] },
    { name: 'cloud-gcp-compute', title: 'GCP Compute', subtitle: 'VM & Cloud Functions', gradient: ['#4285f4', '#1a73e8'] },
    { name: 'cloud-azure-devops', title: 'Azure DevOps', subtitle: 'Pipelines & Repos', gradient: ['#0078d4', '#005a9e'] },
    { name: 'cloud-multi-cloud', title: 'Multi-Cloud', subtitle: 'AWS, GCP, Azure', gradient: ['#667eea', '#764ba2'] },

    // Kubernetes
    { name: 'k8s-cluster', title: 'K8s Cluster', subtitle: 'Production HA Setup', gradient: ['#326ce5', '#1a4d9c'] },
    { name: 'k8s-monitoring', title: 'K8s Monitoring', subtitle: 'Prometheus + Grafana', gradient: ['#326ce5', '#e6522c'] },
    { name: 'k8s-basics', title: 'Kubernetes 101', subtitle: 'Pods, Services, Deployments', gradient: ['#326ce5', '#1a4d9c'] },
    { name: 'kubernetes-helm', title: 'Helm', subtitle: 'Package Manager', gradient: ['#0f1689', '#277a9f'] },
    { name: 'kubernetes-istio', title: 'Istio', subtitle: 'Service Mesh', gradient: ['#466bb0', '#5d9cec'] },
    { name: 'k8s-operators', title: 'Operators', subtitle: 'Custom Controllers', gradient: ['#326ce5', '#5d9cec'] },
    { name: 'k8s-security', title: 'K8s Security', subtitle: 'RBAC, Policies, Secrets', gradient: ['#d73a49', '#cb2431'] },

    // Docker
    { name: 'docker-multistage', title: 'Multi-Stage', subtitle: 'Optimize Docker Images', gradient: ['#2496ed', '#1d6fa5'] },
    { name: 'docker-security', title: 'Docker Security', subtitle: 'Hardening & Scanning', gradient: ['#d73a49', '#cb2431'] },
    { name: 'docker-harbor', title: 'Harbor', subtitle: 'Private Registry', gradient: ['#60d0e4', '#0db7d4'] },
    { name: 'docker-basics', title: 'Docker 101', subtitle: 'Images & Containers', gradient: ['#2496ed', '#1d6fa5'] },
    { name: 'docker-compose', title: 'Docker Compose', subtitle: 'Multi-Container Apps', gradient: ['#2496ed', '#0db7ed'] },
    { name: 'docker-swarm', title: 'Docker Swarm', subtitle: 'Orchestration', gradient: ['#086dd7', '#0070c9'] },
    { name: 'docker-registry', title: 'Docker Registry', subtitle: 'Private Registry', gradient: ['#384d54', '#086dd7'] },

    // CI/CD
    { name: 'gitlab-ci', title: 'GitLab CI', subtitle: 'Multi-Environment Pipeline', gradient: ['#fc6d26', '#e24329'] },
    { name: 'jenkins-pipeline', title: 'Jenkins', subtitle: 'Pipeline as Code', gradient: ['#d24939', '#335061'] },

    // Terraform
    { name: 'devops-terraform', title: 'Terraform', subtitle: 'Infrastructure as Code', gradient: ['#7b42bc', '#5c2d91'] },
    { name: 'terraform-modules', title: 'TF Modules', subtitle: 'Reusable Components', gradient: ['#7b42bc', '#5c4b9e'] },
    { name: 'terraform-state', title: 'TF State', subtitle: 'Remote Backend S3', gradient: ['#7b42bc', '#4040a1'] },

    // Ansible
    { name: 'devops-ansible', title: 'Ansible', subtitle: 'Configuration Management', gradient: ['#ee0000', '#cc0000'] },
    { name: 'ansible-roles', title: 'Ansible Roles', subtitle: 'Reusable Playbooks', gradient: ['#ee0000', '#cc0000'] },
    { name: 'ansible-dynamic', title: 'Dynamic Inventory', subtitle: 'AWS EC2 Discovery', gradient: ['#ee0000', '#990000'] },

    // Monitoring
    { name: 'prometheus-grafana', title: 'Prometheus', subtitle: 'Monitoring Stack', gradient: ['#e6522c', '#ff6b35'] },
    { name: 'jaeger-tracing', title: 'Jaeger', subtitle: 'Distributed Tracing', gradient: ['#60d0e4', '#0db7d4'] },

    // Automation
    { name: 'python-automation', title: 'Python DevOps', subtitle: 'Automation Scripts', gradient: ['#3776ab', '#ffd43b'] },
    { name: 'bash-automation', title: 'Bash Scripts', subtitle: 'Shell Automation', gradient: ['#4eaa25', '#293138'] },
    { name: 'devops-chatops-ai', title: 'ChatOps', subtitle: 'Slack Bot Automation', gradient: ['#4a154b', '#e01e5a'] }
];

// Template SVG
const createSVG = (config) => `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${config.gradient[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${config.gradient[1]};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#grad)"/>
  <text x="400" y="180" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" font-weight="bold">${config.title}</text>
  <text x="400" y="240" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)" text-anchor="middle">${config.subtitle}</text>
  <circle cx="100" cy="320" r="30" fill="rgba(255,255,255,0.2)"/>
  <circle cx="400" cy="320" r="30" fill="rgba(255,255,255,0.3)"/>
  <circle cx="700" cy="320" r="30" fill="rgba(255,255,255,0.2)"/>
</svg>`;

// Créer le dossier si nécessaire
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Générer toutes les images
images.forEach(img => {
    const svgContent = createSVG(img);
    const outputPath = path.join(OUTPUT_DIR, `${img.name}.svg`);
    fs.writeFileSync(outputPath, svgContent);
    console.log(`✅ Créé: ${img.name}.svg`);
});

console.log(`\n🎉 ${images.length} images SVG générées avec succès dans ${OUTPUT_DIR}`);
