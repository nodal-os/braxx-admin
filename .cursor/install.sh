#!/usr/bin/env bash
# Idempotent repository setup for the HAVØK Command Center Cloud Agent env.
# Prepares Node deps, a user-owned PostgreSQL 16 cluster, the Prisma schema,
# and the seeded roles/permissions. Safe to run repeatedly.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

PG_BIN="/usr/lib/postgresql/16/bin"
PG_ROOT="$HOME/.havok"
PGDATA="$PG_ROOT/pgdata"
PG_SOCK="$PG_ROOT/sock"
PG_LOG="$PG_ROOT/pg.log"
DB_NAME="havok_admin"
DB_USER="$(id -un)"

# 0. Ensure PostgreSQL 16 is available (no-op when the base image already has it).
if [ ! -x "$PG_BIN/initdb" ]; then
  sudo DEBIAN_FRONTEND=noninteractive apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq postgresql postgresql-contrib
fi

mkdir -p "$PG_SOCK"

# 1. Initialize a user-owned cluster the first time (trust auth, local only).
if [ ! -f "$PGDATA/PG_VERSION" ]; then
  mkdir -p "$PGDATA"
  "$PG_BIN/initdb" -D "$PGDATA" -U "$DB_USER" --auth=trust >/dev/null
  {
    echo "listen_addresses = 'localhost'"
    echo "port = 5432"
    echo "unix_socket_directories = '$PG_SOCK'"
  } >> "$PGDATA/postgresql.conf"
fi

# 2. Start the cluster if it is not already running (clear any stale lock).
if ! "$PG_BIN/pg_ctl" -D "$PGDATA" status >/dev/null 2>&1; then
  rm -f "$PGDATA/postmaster.pid"
  "$PG_BIN/pg_ctl" -D "$PGDATA" -l "$PG_LOG" -w start
fi

# 3. Create the application database if it does not exist.
if ! "$PG_BIN/psql" -h localhost -p 5432 -U "$DB_USER" -d postgres -tAc \
    "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
  "$PG_BIN/createdb" -h localhost -p 5432 -U "$DB_USER" "$DB_NAME"
fi

# 4. Write local dev env vars once (never overwrite an existing .env).
if [ ! -f .env ]; then
  SECRET="$(openssl rand -base64 32)"
  cat > .env <<EOF
DATABASE_URL="postgresql://$DB_USER@localhost:5432/$DB_NAME?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$SECRET"
EOF
fi

# 5. Install Node dependencies (postinstall runs `prisma generate`).
npm install

# 6. Sync the schema and seed roles/permissions (both idempotent).
npx prisma db push
npm run db:seed

echo "install.sh complete: deps installed, database '$DB_NAME' synced and seeded."
