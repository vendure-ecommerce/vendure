#!/bin/bash

# Collection N+1 Query Benchmark Runner
# This script makes it easy to run the collection N+1 benchmarks

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Collection N+1 Query Benchmark${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Parse arguments
MODE=${1:-quick}
DB=${2:-sqljs}

if [ "$MODE" = "help" ] || [ "$MODE" = "--help" ] || [ "$MODE" = "-h" ]; then
    echo "Usage: $0 [mode] [database]"
    echo ""
    echo "Modes:"
    echo "  quick  - Fast query count test (default)"
    echo "  full   - Complete benchmark with performance metrics"
    echo "  both   - Run both quick and full benchmarks"
    echo ""
    echo "Databases:"
    echo "  sqljs    - SQLite in-memory (default, fastest)"
    echo "  postgres - PostgreSQL (recommended for production)"
    echo "  mysql    - MySQL"
    echo ""
    echo "Examples:"
    echo "  $0 quick          # Quick test with SQLite"
    echo "  $0 full postgres  # Full benchmark with PostgreSQL"
    echo "  $0 both           # Both tests with SQLite"
    exit 0
fi

cd "$(dirname "$0")/../packages/core"

run_quick_test() {
    echo -e "${GREEN}Running Quick Test...${NC}"
    echo -e "${YELLOW}Database: $DB${NC}"
    echo ""

    if [ "$DB" = "sqljs" ]; then
        npm run e2e collection-n-plus-one-quick.e2e-spec.ts
    else
        DB=$DB npm run e2e collection-n-plus-one-quick.e2e-spec.ts
    fi

    echo ""
}

run_full_benchmark() {
    echo -e "${GREEN}Running Full Benchmark...${NC}"
    echo -e "${YELLOW}Database: $DB${NC}"
    echo ""

    if [ "$DB" = "sqljs" ]; then
        npm run bench collection-n-plus-one.bench.ts
    else
        DB=$DB npm run bench collection-n-plus-one.bench.ts
    fi

    echo ""
}

case "$MODE" in
    quick)
        run_quick_test
        ;;
    full)
        run_full_benchmark
        ;;
    both)
        run_quick_test
        echo -e "${BLUE}----------------------------------------${NC}"
        run_full_benchmark
        ;;
    *)
        echo -e "${YELLOW}Unknown mode: $MODE${NC}"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac

echo -e "${GREEN}✓ Benchmark complete${NC}"
echo ""
echo -e "Next steps:"
echo "  1. Record baseline metrics above"
echo "  2. Implement fix in collection.service.ts or resolver"
echo "  3. Run benchmark again to validate improvement"
echo "  4. Target: 0 N+1 queries, <2.0 query efficiency"
echo ""
