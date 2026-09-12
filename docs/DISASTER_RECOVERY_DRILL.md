# Documentation: Monthly Database Disaster Recovery Drill
**Application**: Raman Sweet Bakery  
**Target Architecture**: Neon Serverless PostgreSQL + Next.js  
**Cadence**: Monthly (e.g., 1st Sunday of every month)  
**Safety Policy**: **NEVER** overwrite the live production branch during a drill. All drills must be conducted in an isolated temporary branch or local Docker container.

---

## 1. Prerequisites
Ensure you have the following tools available:
1. `age` (modern file encryption tool: `brew install age` or `sudo apt-get install age` or `winget install FiloSottile.age`)
2. `pg_restore` (PostgreSQL client utilities: version 15+)
3. The private `BACKUP_ENCRYPTION_KEY` from repository secrets.

---

## 2. Step 1 — Download & Decrypt Backup Archive
From your private Cloudflare R2 or AWS S3 bucket, download the latest encrypted archive:
```bash
# Example using AWS CLI or S3-compatible tool
aws s3 cp s3://your-backup-bucket/backups/raman-sweet-bakery-prod-YYYY-MM-DD-HH-mm.dump.age .

# Decrypt using age
age -d -o raman-sweet-bakery-recovered.dump raman-sweet-bakery-prod-YYYY-MM-DD-HH-mm.dump.age
# (When prompted, enter the BACKUP_ENCRYPTION_KEY)
```

---

## 3. Step 2 — Provision Isolated Target Environment

### Option A: Neon Temporary Drill Branch (Cloud-Native, Recommended)
1. In the Neon Console or via Neon CLI:
   ```bash
   neon branches create --name drill-test-restore --parent production
   ```
2. Retrieve the connection string for `drill-test-restore`.

### Option B: Local Docker PostgreSQL
```bash
docker run --name drill-postgres -e POSTGRES_PASSWORD=drillpass -p 5433:5432 -d postgres:16
export DRILL_DATABASE_URL="postgresql://postgres:drillpass@localhost:5433/postgres"
```

---

## 4. Step 3 — Execute Safe Restoration
Restore the custom-format PostgreSQL dump into the **isolated drill database**:
```bash
pg_restore \
  --dbname="$DRILL_DATABASE_URL" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  raman-sweet-bakery-recovered.dump
```

---

## 5. Step 4 — Integrity & Row Count Verification
Run the verification script or execute SQL queries against `$DRILL_DATABASE_URL` to ensure key business entities are 100% intact:

```sql
SELECT 
  (SELECT COUNT(*) FROM "Cake") AS cake_count,
  (SELECT COUNT(*) FROM "CakePrice") AS price_count,
  (SELECT COUNT(*) FROM "Category") AS category_count,
  (SELECT COUNT(*) FROM "Occasion") AS occasion_count,
  (SELECT COUNT(*) FROM "WebsiteSetting") AS website_settings_count,
  (SELECT COUNT(*) FROM "WhatsAppSetting") AS whatsapp_settings_count,
  (SELECT COUNT(*) FROM "User") AS admin_user_count;
```

### Verification Criteria Checklist:
* [ ] `cake_count` > 0 (matches expected production catalog, e.g. ~29)
* [ ] `price_count` > 0 (matches expected prices, e.g. ~107)
* [ ] `category_count` > 0 (matches categories, e.g. ~13)
* [ ] `occasion_count` > 0 (matches occasions, e.g. ~27)
* [ ] `website_settings_count` = 1
* [ ] `whatsapp_settings_count` = 1
* [ ] `admin_user_count` = 1
* [ ] Foreign-key consistency: `SELECT COUNT(*) FROM "CakePrice" WHERE "cakeId" NOT IN (SELECT "id" FROM "Cake");` returns 0.

---

## 6. Step 5 — Clean Up
1. Drop the temporary Neon branch:
   ```bash
   neon branches delete drill-test-restore
   ```
   *or remove the Docker container:*
   ```bash
   docker rm -f drill-postgres
   ```
2. Shred and securely delete the unencrypted local dump:
   ```bash
   rm -f raman-sweet-bakery-recovered.dump
   ```
3. Log the drill result in your compliance record.
