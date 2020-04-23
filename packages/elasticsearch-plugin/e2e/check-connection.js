const { Client } = require('@elastic/elasticsearch');
const { elasticsearchHost, elasticsearchPort } = require('./constants');

const esClient = new Client({
    node: `${elasticsearchHost}:${elasticsearchPort}`,
});

/**
 * When contributing to Vendure, developers who made changes unrelated to
 * this plugin should not be expected to set up an Elasticsearch instance
 * locally just so they can get the pre-push hook to pass. So if no
 * instance is available, we skip the tests.
 */
async function checkConnection() {
    try {
        await esClient.ping({}, { requestTimeout: 1000 });
        // If the connection is available, we exit with 1 in order to invoke the
        // actual e2e test script (since we are using the `||` operator in the "e2e" script)
        return 1;
    } catch (e) {
        console.log(
            `Could not connect to Elasticsearch instance at "${elasticsearchHost}:${elasticsearchPort}"`,
        );
        console.log(`Skipping e2e tests for ElasticsearchPlugin`);
        process.env.SKIP_ELASTICSEARCH_E2E_TESTS = true;
        // If no elasticsearch available, we exit with 0 so that the npm script
        // exits
        return 0;
    }
}

checkConnection().then((result) => {
    process.exit(result);
});
