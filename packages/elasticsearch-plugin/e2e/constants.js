const elasticsearchHost = process.env.CI ? 'http://127.0.0.1' : 'http://192.168.99.100';
const elasticsearchPort = process.env.CI ? +(process.env.E2E_ELASTIC_PORT || 9200) : 9200;

module.exports = {
    elasticsearchHost,
    elasticsearchPort,
};
