# Admin Interface

A comprehensive admin panel for managing the Texas Power Compare platform.

## Features

### ✅ Password Protection
- Simple session-based authentication
- Password: `admin123` (demo password - change in production)
- Session persists until browser is closed or user logs out

### ✅ Dashboard
- Quick statistics overview:
  - Total providers
  - Active plans
  - Total plans (including inactive)
  - Cities covered
- Recent plans table
- Quick action cards to navigate to key sections

### ✅ Plan Management
- **View All Plans** - List all electricity plans with filtering
  - Filter by: All, Active, Inactive
  - Display: Provider, Plan Name, Type, Rate @1000kWh, Contract, Status
  - Actions: Edit, Delete

- **Add New Plan** - Comprehensive form with:
  - Provider selection (dropdown)
  - Plan details (name, type, contract length)
  - Rate tiers (500, 1000, 2000 kWh)
  - Fees (base charge, early termination)
  - Renewable percentage
  - Plan features (checkboxes):
    - Free nights
    - Free weekends
    - Bill credit
    - No deposit
    - Smart thermostat
    - 100% renewable
    - Fixed rate guarantee
    - No cancellation fee
  - Document URLs (EFL, TOS, YRAC)
  - Active status toggle

- **Edit Plan** - Update existing plans (coming soon)

### ✅ Provider Management
- View all providers with details
- See plan count for each provider
- Link to view provider-specific plans

## API Endpoints

### Plans
- `GET /api/admin/plans` - Fetch all plans
- `POST /api/admin/plans` - Create new plan
- `GET /api/admin/plans/[id]` - Fetch single plan
- `PUT /api/admin/plans/[id]` - Update plan
- `DELETE /api/admin/plans/[id]` - Delete plan

### Providers
- `GET /api/admin/providers` - Fetch all providers (for dropdowns)

## Usage

### Access the Admin Panel

1. Navigate to `/admin` in your browser
2. Enter password: `admin123`
3. Click "Login"

### Add a New Plan

1. From dashboard, click "Add New Plan" or navigate to `/admin/plans/new`
2. Select a provider from the dropdown
3. Enter plan details:
   - Plan name (e.g., "Energy Saver 12")
   - Plan type (Fixed, Variable, or Prepaid)
   - Contract length (0 for month-to-month)
4. Enter rate tiers in cents per kWh:
   - @ 500 kWh
   - @ 1,000 kWh
   - @ 2,000 kWh
5. Enter fees (optional):
   - Base charge (monthly fee in dollars)
   - Early termination fee (in dollars)
6. Set renewable percentage (0-100)
7. Select plan features (check all that apply)
8. Add document URLs (optional but recommended):
   - EFL - Electricity Facts Label
   - TOS - Terms of Service
   - YRAC - Your Rights as a Customer
9. Toggle "Plan is Active" if you want it visible to users
10. Click "Save Plan"

### Manage Existing Plans

1. Navigate to `/admin/plans`
2. Use filters to view All, Active, or Inactive plans
3. Click Edit icon to modify a plan
4. Click Delete icon to remove a plan (confirmation required)

### View Providers

1. Navigate to `/admin/providers`
2. View all providers with their details
3. Click "View Plans →" to see plans from a specific provider

## Security Considerations

### Current Implementation (Demo)
- Hardcoded password in client-side code
- Session storage for authentication state
- No encryption or hashing
- **NOT suitable for production use**

### Production Recommendations

1. **Implement proper authentication:**
   ```typescript
   - Use NextAuth.js or similar auth library
   - Hash passwords with bcrypt
   - Use httpOnly cookies for sessions
   - Add CSRF protection
   - Implement role-based access control (RBAC)
   ```

2. **Add API authentication:**
   ```typescript
   - Verify user session in API routes
   - Use middleware for auth checks
   - Rate limit API endpoints
   - Add request validation
   ```

3. **Environment-based configuration:**
   ```typescript
   - Store admin credentials in environment variables
   - Use different passwords per environment
   - Implement 2FA for production
   ```

4. **Audit logging:**
   ```typescript
   - Log all admin actions
   - Track who created/modified/deleted plans
   - Monitor for suspicious activity
   ```

## File Structure

```
app/admin/
├── layout.tsx              # Auth wrapper with password protection
├── page.tsx               # Dashboard with stats and quick actions
├── plans/
│   ├── page.tsx          # Plans list with filtering
│   ├── new/
│   │   └── page.tsx      # Add new plan form
│   └── [id]/
│       └── edit/
│           └── page.tsx  # Edit plan form (coming soon)
├── providers/
│   └── page.tsx          # Providers list
└── README.md             # This file

app/api/admin/
├── plans/
│   ├── route.ts          # GET all, POST new plan
│   └── [id]/
│       └── route.ts      # GET, PUT, DELETE single plan
└── providers/
    └── route.ts          # GET all providers
```

## Data Model

### Plan Schema
```typescript
{
  id: UUID,
  provider_id: UUID (references providers),
  plan_name: string,
  plan_type: 'Fixed' | 'Variable' | 'Prepaid',
  contract_length_months: number,
  rate_500kwh: number,
  rate_1000kwh: number,
  rate_2000kwh: number,
  base_charge: number,
  early_termination_fee: number | null,
  renewable_percentage: number,
  features: string[],
  efl_url: string | null,
  tos_url: string | null,
  yrac_url: string | null,
  is_active: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
```

## Future Enhancements

### Planned Features
- [ ] Edit plan functionality
- [ ] Bulk plan import/export
- [ ] ZIP code coverage management
- [ ] Plan comparison preview
- [ ] Analytics dashboard
- [ ] Provider CRUD operations
- [ ] City management
- [ ] User activity logs
- [ ] Advanced filtering and search
- [ ] Plan templates
- [ ] Seasonal rate management

### Advanced Features
- [ ] Multi-user support with roles
- [ ] Plan version history
- [ ] Automated plan data imports
- [ ] Rate change notifications
- [ ] Competitive analysis tools
- [ ] Customer feedback integration

## Troubleshooting

### "Failed to fetch providers"
- Check that providers exist in the database
- Run `npm run update:providers` to populate providers
- Verify Supabase connection

### "Failed to create plan"
- Ensure all required fields are filled
- Check that provider_id is valid
- Verify rate values are positive numbers
- Check browser console for detailed errors

### "Cannot access admin panel"
- Clear browser cache and try again
- Check sessionStorage in browser DevTools
- Verify you're using the correct password
- Try logging out and back in

## Support

For issues or questions about the admin interface:
1. Check the browser console for errors
2. Review the API response in Network tab
3. Verify database permissions in Supabase
4. Check this README for guidance

## Development

### Adding New Features

1. **New admin page:**
   - Create in `app/admin/[feature]/page.tsx`
   - Add link to dashboard
   - Follow existing patterns

2. **New API endpoint:**
   - Create in `app/api/admin/[resource]/route.ts`
   - Add proper error handling
   - Validate input data
   - Return consistent response format

3. **Update data model:**
   - Update TypeScript interfaces
   - Modify form fields
   - Update API routes
   - Update validation logic

### Testing

1. Test with sample data first
2. Verify all form validations work
3. Test error scenarios
4. Check mobile responsiveness
5. Test with different browsers

## License

Part of the Texas Power Compare project.
