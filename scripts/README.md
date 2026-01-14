# Database Scripts

This directory contains scripts for managing the Texas Power Compare database.

## Available Scripts

### Update Providers

Updates the database with real Texas electricity provider information for 25 major companies.

```bash
npm run update:providers
```

**What it does:**
- Deletes existing provider records
- Inserts 25 real Texas electricity providers with:
  - Company names and slugs
  - Website URLs
  - Phone numbers
  - Descriptions
  - Placeholder logo URLs (using ui-avatars.com)
  - Customer ratings

**Providers included:**
1. TXU Energy
2. Reliant Energy
3. Direct Energy
4. Gexa Energy
5. Green Mountain Energy
6. 4Change Energy
7. Frontier Utilities
8. Constellation
9. Discount Power
10. Chariot Energy
11. Champion Energy
12. Cirro Energy
13. Rhythm Energy
14. TriEagle Energy
15. Payless Power
16. APG&E
17. Amigo Energy
18. Pulse Power
19. Veteran Energy
20. GoodCharlie
21. Express Energy
22. Texpo Energy
23. Pennywise Power
24. Tomorrow Energy

### Seed Cities

Seeds the database with Texas cities data.

```bash
npm run seed:cities
```

### Seed Database

Seeds the database with initial data (providers and plans).

```bash
npm run seed
```

## Environment Setup

Before running any scripts, ensure you have:

1. Created a `.env.local` file with Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Set up your Supabase database with the required tables:
   - `providers` - Electricity providers
   - `plans` - Electricity plans
   - `cities` - Texas cities

## Next Steps After Running Scripts

### 1. Update Provider Logos (Optional)

The script currently uses placeholder logos from ui-avatars.com. To use real provider logos:

1. Obtain actual provider logos (ensure you have rights to use them)
2. Upload logos to a CDN or public storage
3. Update the `logo_url` field in the database for each provider

### 2. Add Real Electricity Plans

The current plans are sample data. To add real plans:

1. Create a new script (e.g., `scripts/update-plans.ts`)
2. Fetch real plan data from Power to Choose API or web scraping
3. Map plans to the correct provider IDs
4. Insert real plan data with accurate rates, fees, and terms

### 3. Update Plan Details

For each plan, ensure you have:
- `plan_name` - Official plan name
- `rate_500kwh`, `rate_1000kwh`, `rate_2000kwh` - Rates in cents per kWh
- `contract_length_months` - Contract term (0 for month-to-month)
- `plan_type` - "Fixed", "Variable", or "Prepaid"
- `renewable_percentage` - % of renewable energy (0-100)
- `base_charge` - Monthly base fee in dollars
- `early_termination_fee` - Cancellation fee in dollars
- `features` - JSON array of plan features

## Troubleshooting

### "Missing Supabase environment variables"

Make sure your `.env.local` file exists and contains the correct Supabase credentials.

### "Error deleting providers"

Check that your Supabase database has the `providers` table with the correct schema.

### "Error inserting providers"

Verify that:
- The providers table exists
- You have write permissions
- The table schema matches the data structure
- There are no unique constraint violations

## Database Schema

### Providers Table

```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  website TEXT,
  phone TEXT,
  description TEXT,
  logo_url TEXT,
  rating DECIMAL(2,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Plans Table

```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  rate_500kwh DECIMAL(5,2) NOT NULL,
  rate_1000kwh DECIMAL(5,2) NOT NULL,
  rate_2000kwh DECIMAL(5,2) NOT NULL,
  contract_length_months INTEGER NOT NULL,
  plan_type TEXT NOT NULL,
  renewable_percentage INTEGER DEFAULT 0,
  base_charge DECIMAL(6,2) DEFAULT 0,
  early_termination_fee DECIMAL(6,2),
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Support

For issues or questions, please check the main project README or create an issue in the repository.
