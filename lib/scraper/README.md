# Power to Choose Scraper

Automated system for fetching and updating electricity plan data from [Power to Choose](http://www.powertochoose.org), the official Texas electricity comparison site.

## Overview

The scraper system automatically:
- Attempts to fetch plan data from Power to Choose for major Texas ZIP codes
- Falls back to estimated market data if the API is unavailable
- Parses plan details (rates, contract terms, fees, documents)
- Deduplicates plans that appear in multiple ZIP codes
- Compares with your database to identify new plans, price changes, and removed plans
- Optionally updates the database automatically

## Data Source Strategy

**Important:** Power to Choose uses a dynamic website that doesn't provide a simple public API. The scraper implements a fallback strategy:

1. **First:** Attempts to fetch from Power to Choose API (placeholder for future implementation)
2. **Fallback:** Generates estimated plan data based on current Texas market conditions

### Estimated Data Approach

When using estimated data:
- Plans are generated based on typical Texas electricity rates (8-16¢ per kWh)
- Includes realistic variations across contract lengths and providers
- All plans marked with `dataSource: 'estimated'` and `requiresVerification: true`
- Warnings displayed in admin UI
- Users should verify rates at powertochoose.org before publishing

This approach allows the scraper to function immediately while providing a path for real API integration in the future.

## Architecture

### Components

1. **power-to-choose.ts** - Core scraper module
   - Fetches data from Power to Choose API
   - Parses plan details
   - Maps provider names to database slugs

2. **scraper-service.ts** - Service coordinator
   - Manages scraping across multiple ZIP codes
   - Deduplicates plans
   - Compares with database
   - Applies changes

3. **API Route** - `/api/admin/scrape`
   - Triggers scrapes from admin panel
   - Returns results

4. **Admin UI** - `/admin/scrape`
   - "Run Scrape" button
   - Preview changes
   - View scrape history

5. **Scheduled Script** - `scripts/scheduled-scrape.ts`
   - Runs via cron job
   - Logs results
   - (Optional) sends email summary

## How It Works

### 1. Scraping Process

The scraper targets these major ZIP codes representing different utility areas:

| ZIP Code | City        | Utility            |
|----------|-------------|--------------------|
| 77001    | Houston     | CenterPoint Energy |
| 75201    | Dallas      | Oncor              |
| 78701    | Austin      | Austin Energy      |
| 76101    | Fort Worth  | Oncor              |
| 78201    | San Antonio | CPS Energy         |
| 79901    | El Paso     | El Paso Electric   |

For each ZIP code:
1. Makes HTTP request to Power to Choose API
2. Parses JSON response
3. Extracts plan details
4. Maps provider names to database IDs

### 2. Deduplication

Plans appear in multiple ZIP codes. The scraper:
- Creates unique key: `${providerName}::${planName}`
- Keeps one instance of each unique plan
- Prefers plans with complete document URLs

### 3. Database Comparison

Compares scraped plans with database to find:

**New Plans:**
- Plans from known providers that don't exist in database
- Require manual review and addition via admin panel

**Updated Plans:**
- Existing plans with rate changes >0.1¢
- Can be auto-updated or reviewed first

**Removed Plans:**
- Database plans no longer available from Power to Choose
- Marked as inactive automatically (if auto-apply enabled)

### 4. Rate Limiting

- 2-second delay between ZIP code requests
- Respectful to Power to Choose servers
- Prevents rate limiting/blocking

## Estimated Data Generation

When the Power to Choose API is unavailable, the scraper generates realistic estimated plan data:

### Plan Generation Logic

- **8 Major Providers:** TXU Energy, Reliant Energy, Direct Energy, Gexa Energy, Green Mountain Energy, 4Change Energy, Constellation, Chariot Energy
- **5 Plan Templates:** Value 12, Fixed 12, Saver 24, Green 12, Freedom Month-to-Month
- **2-3 plans per provider** = 16-24 total plans per ZIP code
- **Rate variation:** Base rates + random variation (-0.5 to +0.5¢) for realism
- **Rate structure:**
  - 500 kWh rate = base + 1.5¢ (higher for low usage)
  - 1000 kWh rate = base rate
  - 2000 kWh rate = base - 0.8¢ (lower for high usage)

### Plan Details

- **Base rates:** 9.8¢ to 13.5¢ per kWh (typical Texas market range)
- **Contract lengths:** 0 (month-to-month), 12, or 24 months
- **Early termination fee:** Contract length × $15 (or $0 for month-to-month)
- **Base charge:** $5-$10 per month (random)
- **Renewable percentage:** 0% or 100% (for Green plans)
- **Features:** Based on plan type (fixed_rate, renewable_energy, no_cancellation_fee, etc.)
- **Document URLs:** Placeholder links to Power to Choose
- **Verification flag:** All estimated plans marked with `requiresVerification: true`

### Data Source Tracking

Each scraped plan includes:
- `dataSource: 'api' | 'estimated' | 'mock'` - Where the data came from
- `requiresVerification: boolean` - Whether manual verification is needed

The scrape session tracks:
- `dataSource` - Overall source for the session (api/estimated/mixed)
- `warnings[]` - Array of warning messages about data quality

## Usage

### Via Admin Panel

1. Navigate to `/admin/scrape`
2. Click "Run Scrape (Preview Only)" to preview changes
3. Or click "Run Scrape & Auto-Apply" to update database automatically

### Via Command Line

```bash
# Preview mode (no database changes)
npm run scrape:preview

# Auto-apply mode (updates database)
npm run scrape
```

### Scheduled via Cron

Add to your crontab (Linux/Mac):

```cron
# Run scrape every day at 2 AM
0 2 * * * cd /path/to/project && npm run scrape >> /path/to/project/logs/cron.log 2>&1

# Run scrape every Monday at 3 AM
0 3 * * 1 cd /path/to/project && npm run scrape >> /path/to/project/logs/cron.log 2>&1

# Run scrape on the 1st of every month at 4 AM
0 4 1 * * cd /path/to/project && npm run scrape >> /path/to/project/logs/cron.log 2>&1
```

**Recommended Schedule:** Weekly on Monday mornings

## Provider Mapping

The scraper maps Power to Choose provider names to your database slugs:

```typescript
'TXU Energy' → 'txu-energy'
'Reliant Energy' → 'reliant-energy'
'Green Mountain Energy' → 'green-mountain-energy'
// ... and 21 more
```

### Adding New Providers

If the scraper finds plans from a provider not in the mapping:

1. The plan will be included in scrape results
2. `providerSlug` will be `null`
3. Plan won't be automatically added to database

**To add a new provider:**

1. Add the provider to your database first:
   ```bash
   npm run update:providers
   ```

2. Update the mapping in `power-to-choose.ts`:
   ```typescript
   const PROVIDER_NAME_MAP: Record<string, string> = {
     // ... existing mappings
     'New Provider Inc': 'new-provider',
   };
   ```

3. Run scraper again to pick up plans from the new provider

## Data Fields Extracted

| Field | Description | Example |
|-------|-------------|---------|
| Provider Name | Company name | "TXU Energy" |
| Plan Name | Plan product name | "Energy Saver 12" |
| Plan Type | Fixed/Variable/Prepaid | "Fixed" |
| Contract Length | Months (0 = month-to-month) | 12 |
| Rate @ 500 kWh | Cents per kWh | 12.5 |
| Rate @ 1000 kWh | Cents per kWh | 11.2 |
| Rate @ 2000 kWh | Cents per kWh | 10.8 |
| Renewable % | Percentage of renewable energy | 25 |
| Base Charge | Monthly fixed fee | 9.95 |
| ETF | Early termination fee | 150.00 |
| EFL URL | Electricity Facts Label PDF | https://... |
| TOS URL | Terms of Service PDF | https://... |
| YRAC URL | Your Rights as a Customer PDF | https://... |
| Features | Array of plan features | ["free_nights", "no_deposit"] |

## Auto-Apply Behavior

When auto-apply is enabled:

**✅ Automatically Applied:**
- Rate updates for existing plans
- Marking removed plans as inactive

**❌ NOT Automatically Applied:**
- Adding new plans to database
- Changing contract lengths
- Updating plan types
- Modifying provider associations

**Why?** New plans require human review to ensure data quality and avoid duplicates.

## Logs

Scrape results are logged to:
```
logs/scrape-YYYY-MM-DD.log
```

Log contents:
- Session ID and timestamps
- ZIP codes scraped
- Plans found (total and unique)
- Changes detected (new/updated/removed)
- Errors encountered
- Applied changes (if auto-apply)

## Error Handling

The scraper handles errors gracefully:

**Network Errors:**
- Logs error for specific ZIP code
- Continues with remaining ZIP codes
- Returns partial results

**Parse Errors:**
- Logs problematic plan data
- Skips individual plan
- Continues processing other plans

**Database Errors:**
- Logs error details
- Doesn't crash entire scrape
- Reports in scrape results

## Troubleshooting

### "No plans found for ZIP code"

**Causes:**
- Power to Choose API is down (expected - no public API exists)
- ZIP code not in deregulated area
- Network connectivity issues

**Solutions:**
- The scraper should automatically fall back to estimated data
- Check the admin UI for "Estimated Market Data" badge
- Verify estimated data at powertochoose.org manually
- Check ZIP code is in deregulated Texas

### "Using estimated data" warnings

**This is normal and expected behavior.**

**Causes:**
- Power to Choose doesn't provide a simple public API
- The scraper falls back to generating realistic market data

**What to do:**
- Review the estimated plans in the admin UI
- Verify rates at powertochoose.org before publishing to users
- Use the data for development/testing
- Consider implementing a headless browser solution for real API access (see Future Enhancements)

### "Provider mapping not found"

**Causes:**
- New provider not in mapping
- Provider name changed on Power to Choose

**Solutions:**
- Add provider to database first
- Update PROVIDER_NAME_MAP in power-to-choose.ts
- Check provider name spelling

### "Rate limiting detected"

**Causes:**
- Too many requests too quickly
- Scraper delay too short

**Solutions:**
- Increase delay in scraper-service.ts
- Wait before running again
- Don't run multiple scrapes simultaneously

### "Plans not updating in database"

**Causes:**
- Preview mode enabled
- Database connection issues
- Provider ID not found

**Solutions:**
- Use auto-apply mode or apply manually
- Check Supabase connection
- Verify provider exists in database

### "Duplicate plans created"

**Causes:**
- Deduplication logic failed
- Plan name variations

**Solutions:**
- Manual cleanup in admin panel
- Improve deduplication key logic
- Report issue for investigation

## Best Practices

### Scraping Frequency

**Recommended:** Weekly (Monday mornings)

**Why?**
- Plans don't change daily
- Reduces load on Power to Choose
- Gives you time to review changes

**Too Frequent:**
- Daily scraping is excessive
- Unnecessary load on servers
- More likely to hit rate limits

**Too Infrequent:**
- Monthly may miss rate changes
- Users see outdated pricing

### Review Process

1. **Run preview scrape** first
2. **Review changes** in admin UI:
   - Check price increases are accurate
   - Verify removed plans should be deactivated
   - Examine new plans before adding
3. **Apply changes** manually or via auto-apply
4. **Add new plans** through admin panel after review

### Monitoring

Set up monitoring for:
- **Failed scrapes** - Check logs, investigate causes
- **Large price changes** - Review before applying
- **Many removed plans** - Could indicate API issue
- **Error rate** - High errors need investigation

### Data Quality

To maintain quality:
- **Review new plans** before adding to database
- **Check for duplicates** if deduplication fails
- **Verify rate changes** seem reasonable
- **Update provider mappings** as providers change

## API Reference

### Power to Choose API

**Endpoint:**
```
http://www.powertochoose.org/api/plans?zip={zipCode}
```

**Response:**
```json
[
  {
    "rep_company": "TXU Energy",
    "plan_name": "Energy Saver 12",
    "plan_type": "Fixed",
    "term_value": "12",
    "price_kwh500": "12.5",
    "price_kwh1000": "11.2",
    "price_kwh2000": "10.8",
    "renewable_energy_percent": "25",
    "base_charge": "9.95",
    "cancellation_fee": "150",
    "fact_sheet_url": "https://...",
    "terms_of_service_url": "https://...",
    // ... more fields
  }
]
```

**Rate Limits:** Unknown, use responsibly

### Internal API

**POST /api/admin/scrape**

Request:
```json
{
  "autoApply": false
}
```

Response:
```json
{
  "success": true,
  "session": {
    "sessionId": "scrape_...",
    "status": "completed",
    "totalPlansFound": 250,
    "uniquePlans": 150,
    "newPlans": [...],
    "updatedPlans": [...],
    "removedPlans": [...],
    "errors": []
  }
}
```

## Future Enhancements

Potential improvements:

- [ ] **Real API Integration** - Implement headless browser (Puppeteer/Playwright) to scrape Power to Choose directly
  - Navigate to powertochoose.org
  - Submit ZIP code forms
  - Parse dynamic HTML results
  - Extract real-time plan data
- [ ] Email notifications for scrape results
- [ ] Slack/Discord webhook integration
- [ ] Historical rate tracking and charts
- [ ] Smart rate change detection (unusual increases)
- [ ] Automatic provider mapping suggestions
- [ ] ZIP code coverage expansion
- [ ] Plan feature extraction improvements
- [ ] Diff view for plan changes
- [ ] Rollback capability for auto-applied changes
- [ ] Rate alert system for users
- [ ] Data quality scoring for estimated vs. real data

## Support

For issues:
1. Check logs in `logs/scrape-*.log`
2. Review this README for troubleshooting
3. Check browser console (if using admin UI)
4. Verify Supabase connection
5. Test Power to Choose API manually

## License

Part of the Texas Power Compare project.

## Contributing

To improve the scraper:
1. Test changes with preview mode first
2. Add error handling for edge cases
3. Update documentation for new features
4. Consider rate limiting impact
5. Maintain backward compatibility
