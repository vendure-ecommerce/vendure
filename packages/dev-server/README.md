# Vendure Dev Server

This package is not published to npm. It is used in development of the Vendure server and plugins.

### Running

To run the server, run the `start` script. The database configuration can be specified by the `DB=<type>` environment variable:

```bash
DB=mysql yarn start
DB=postgres yarn start
DB=sqlite yarn start
```

The default if no db is specified is mysql.

### Populating data

Test data can be populated by running the `populate` script. This uses the same sample data as is used by the Vendure CLI when running `init`, albeit with the additional step of populating some sample customer & address data too.

Specify the database as above to populate that database:

```bash
DB=sqlite yarn populate
```

## Load testing

This package also contains scripts for load testing the Vendure server. The load testing infrastructure and scripts are located in the [`./load-testing`](./load-testing) directory.

Load testing is done with [k6](https://docs.k6.io/), and to run them you will need k6 installed and (in Windows) available in your PATH environment variable so that it can be run with the command `k6`.

The load tests assume the existence of the following tables in the MySQL database:

* `vendure-load-testing-1000`
* `vendure-load-testing-10000`
* `vendure-load-testing-100000`

The npm scripts `load-test:1k`, `load-test:10k` and `load-test:100k` will populate their respective databases with test data and then run the k6 scripts against them.

### Results

The results of the test are saved to the [`./load-testing/results`](./load-testing/results) directory.


