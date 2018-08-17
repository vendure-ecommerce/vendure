// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, '../coverage'),
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        customLaunchers: {
            ChromeHeadlessCI: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        singleRun: false,
        // TODO: this whole "webpack" section is a hack to get around this issue with
        // the graphql-js lib: https://github.com/aws-amplify/amplify-js/issues/686#issuecomment-387710340
        // also: https://github.com/graphql/graphql-js/issues/1272
        // Once v14.0.0 is out it may be possible to remove it. Check that the apollo codegen
        // script still works (may need to upgrade apollo package too at that point)
        webpack: {
            module: {
                rules: [
                    ...config.buildWebpack.webpackConfig.module.rules,
                    {
                      test: /\.mjs$/,
                      include: /node_modules/,
                      type: "javascript/auto",
                    }
                ]
            }
        }
    });
};
