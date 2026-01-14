/**
 * Fix Active Plans - Update all plans to is_active = true
 * and verify database state
 */

import { createStaticClient } from '@/lib/supabase';

async function fixActivePlans() {
  const supabase = createStaticClient();

  console.log('🔍 Checking database state...\n');

  // Step 1: Check current state
  const { data: allPlans, error: allError } = await supabase
    .from('plans')
    .select('id, plan_name, is_active, provider:providers(name)');

  if (allError) {
    console.error('❌ Error fetching plans:', allError);
    return;
  }

  console.log(`📊 Total plans in database: ${allPlans?.length || 0}`);

  const activePlans = allPlans?.filter(p => p.is_active) || [];
  const inactivePlans = allPlans?.filter(p => !p.is_active) || [];

  console.log(`✅ Active plans: ${activePlans.length}`);
  console.log(`❌ Inactive plans: ${inactivePlans.length}\n`);

  if (inactivePlans.length > 0) {
    console.log('📋 Sample inactive plans:');
    inactivePlans.slice(0, 5).forEach((plan, i) => {
      const provider: any = plan.provider;
      const providerName = Array.isArray(provider) ? provider[0]?.name : provider?.name;
      console.log(`  ${i + 1}. ${providerName || 'Unknown'} - ${plan.plan_name}`);
    });
    console.log();
  }

  // Step 2: Update all plans to active
  if (inactivePlans.length > 0) {
    console.log(`🔄 Updating ${inactivePlans.length} plans to is_active = true...\n`);

    const { data: updated, error: updateError } = await supabase
      .from('plans')
      .update({ is_active: true })
      .eq('is_active', false)
      .select('id');

    if (updateError) {
      console.error('❌ Error updating plans:', updateError);
      return;
    }

    console.log(`✅ Successfully updated ${updated?.length || 0} plans to active\n`);
  } else {
    console.log('✅ All plans are already active!\n');
  }

  // Step 3: Verify final state
  const { count: finalCount, error: countError } = await supabase
    .from('plans')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (countError) {
    console.error('❌ Error counting active plans:', countError);
    return;
  }

  console.log(`✅ Final active plans count: ${finalCount}\n`);

  // Step 4: Check provider_id references
  const { data: plansWithoutProvider, error: orphanError } = await supabase
    .from('plans')
    .select('id, plan_name, provider_id')
    .is('provider_id', null);

  if (orphanError) {
    console.error('❌ Error checking for orphaned plans:', orphanError);
  } else {
    if (plansWithoutProvider && plansWithoutProvider.length > 0) {
      console.log(`⚠️  Found ${plansWithoutProvider.length} plans without provider_id`);
    } else {
      console.log('✅ All plans have valid provider_id references');
    }
  }

  console.log('\n🎉 Fix completed!');
}

// Run the fix
fixActivePlans().catch(console.error);
