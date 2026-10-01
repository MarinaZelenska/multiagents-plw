pipeline {
  agent {
    node {
      label 'built-in'
      customWorkspace '../../qauto-playwright-starter/playwright-starter'
    }
  }

  options {
    timestamps()
    disableConcurrentBuilds()
    skipDefaultCheckout(true)
  }

  environment {
    CI = 'true'
    PATH = '../.nvm/versions/node/v22.14.0/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin'
  }

  stages {
    stage('Project') {
      steps {
        sh 'test -f package.json && test -f .playwright/cli.config.json'
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install chromium'
      }
    }

    stage('TypeScript') {
      steps {
        sh 'npx tsc --noEmit'
      }
    }

    stage('Playwright') {
      steps {
        sh 'npx playwright test --retries=0 --workers=1'
      }
    }
  }

  post {
    always {
      archiveArtifacts allowEmptyArchive: true, artifacts: 'playwright-report/**,test-results/**'
    }
  }
}
