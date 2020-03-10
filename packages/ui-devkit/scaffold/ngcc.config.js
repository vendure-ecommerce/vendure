// Prevents false positive warnings from the ng compatibility compiler.
// See https://github.com/angular/angular/pull/35683
module.exports = {
    packages: {
        '@vendure/admin-ui': {
            ignorableDeepImportMatchers: [
                /@vendure\/common\//,
                /@clr\/icons\//,
                /@webcomponents\//,
                /graphql\//,
            ]
        },
    }
};
