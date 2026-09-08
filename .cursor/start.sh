#!/usr/bin/env bash
# Per-boot startup: make sure the user-owned PostgreSQL cluster is running.
# Idempotent and safe on snapshot boots (clears a stale lock/socket).
set -euo pipefail

PG_BIN="/usr/lib/postgresql/16/bin"
PG_ROOT="$HOME/.havok"
PGDATA="$PG_ROOT/pgdata"
PG_SOCK="$PG_ROOT/sock"
PG_LOG="$PG_ROOT/pg.log"

mkdir -p "$PG_SOCK"

if "$PG_BIN/pg_ctl" -D "$PGDATA" status >/dev/null 2>&1; then
  echo "postgres already running"
else
  rm -f "$PGDATA/postmaster.pid" "$PG_SOCK"/.s.PGSQL.5432*
  "$PG_BIN/pg_ctl" -D "$PGDATA" -l "$PG_LOG" -w start
fi

"$PG_BIN/pg_isready" -h localhost -p 5432
