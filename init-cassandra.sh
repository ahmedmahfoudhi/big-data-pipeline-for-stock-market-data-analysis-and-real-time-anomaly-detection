#!/bin/bash

# Wait for Cassandra to start
until cqlsh -e "DESCRIBE KEYSPACES" 2> /dev/null; do
  >&2 echo "Cassandra is unavailable - sleeping"
  sleep 10
done

# Create keyspace and table
cqlsh -e "CREATE KEYSPACE IF NOT EXISTS stock_market WITH replication = {'class':'SimpleStrategy', 'replication_factor':1};"
cqlsh -e "USE stock_market; CREATE TABLE IF NOT EXISTS stock_table (id uuid PRIMARY KEY,adj_close double, close double, day int, high double, low double, month int, open double, volume double, year int);"
