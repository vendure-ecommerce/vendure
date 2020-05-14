const http = require('http');

const healthUrl = 'http://localhost:3000/health';
const shopUrl = 'http://localhost:3000/shop-api';
const adminUrl = 'http://localhost:3000/admin-api';

awaitServerStartup()
    .then(() => runTests())
    .catch((e) => {
        console.log('Tests failed!');
        console.log(e);
        process.exit(1);
    });

function awaitServerStartup() {
    console.log('Checking for availability of Vendure Server...');
    let attempts = 0;
    return new Promise((resolve, reject) => {
        async function poll() {
            try {
                let result = await request(healthUrl, 'GET');
                if (result && result.status === 'ok') {
                    console.log('Server is running!');
                    resolve();
                    return;
                }
            } catch (e) {
                //
            }
            attempts++;
            if (attempts < 15) {
                console.log('Server not yet available, waiting 500ms...');
                setTimeout(poll, 500);
            } else {
                reject('Unable to establish connection to Vendure server!');
            }
        }
        poll();
    });
}

async function runTests() {
    console.log('Running some smoke tests...');
    const result1 = await gqlRequest(
        shopUrl,
        `
        { "query": "{ products(options: { take: 3 })  { items { id name } } }" }
    `,
    );
    assertEquals(result1.data.products.items, [
        { id: '1', name: 'Laptop' },
        { id: '2', name: 'Tablet' },
        { id: '3', name: 'Wireless Optical Mouse' },
    ]);

    const result2 = await gqlRequest(
        adminUrl,
        `
        { "query": "mutation { login(username: \\"superadmin\\" password: \\"superadmin\\")  { user { id } } }" }
    `,
    );
    assertEquals(result2.data.login, { user: { id: '1' } });

    console.log(`All tests passed!`);
    process.exit(1);
}

function gqlRequest(url, body) {
    return request(url, 'POST', body).catch((e) => console.log(e));
}

/**
 *
 * @param url
 * @param body
 * @return {Promise<unknown>}
 */
function request(url, method, body) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        const req = http.request(url, options, (res) => {
            var response = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                return (response += chunk);
            });
            res.on('end', () => {
                resolve(JSON.parse(response));
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        // Write data to request body
        req.write(body || '');
        req.end();
    });
}

function assertEquals(actual, expected) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        console.log(`Expected [${JSON.stringify(actual)}] to equal [${JSON.stringify(expected)}]`);
        process.exit(1);
    }
}
