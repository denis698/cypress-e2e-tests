const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: false,
  screenshotsFolder: 'cypress/images',
  reporter: 'cypress-mochawesome-reporter',
  viewportWidth: 1920,
  viewportHeight: 1200,
  defaultCommandTimeout: 30000,
  watchForFileChanges: true,
  reporterOptions: {
    reportPageTitle: 'Nexudus UI E2E Test Results',
    reportTitle: 'Nexudus UI E2E Test Results',
    reportDir: 'cypress/report',
    charts: true,
    inlineAssets: true,
    embeddedScreenshots: true,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://dashboard.nexudus.com',
  },
})
