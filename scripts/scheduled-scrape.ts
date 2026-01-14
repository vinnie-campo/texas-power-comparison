/**
 * Scheduled Scrape Script
 * Run automated scraping of Power to Choose data
 *
 * Usage:
 *   npm run scrape             # Run with auto-apply
 *   npm run scrape:preview     # Preview changes only
 */

import { runFullScrape } from '../lib/scraper/scraper-service';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Check for --preview flag
const isPreview = process.argv.includes('--preview');
const autoApply = !isPreview;

const LOG_DIR = join(process.cwd(), 'logs');
const LOG_FILE = join(LOG_DIR, `scrape-${new Date().toISOString().split('T')[0]}.log`);

/**
 * Write to log file
 */
function log(message: string): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  // Console output
  console.log(message);

  // File output
  try {
    // Ensure log directory exists
    if (!existsSync(LOG_DIR)) {
      mkdirSync(LOG_DIR, { recursive: true });
    }

    // Append to log file
    writeFileSync(LOG_FILE, logMessage, { flag: 'a' });
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
}

/**
 * Main scrape function
 */
async function main() {
  log('═'.repeat(80));
  log('🤖 AUTOMATED SCRAPE JOB STARTED');
  log(`Mode: ${isPreview ? 'PREVIEW' : 'AUTO-APPLY'}`);
  log('═'.repeat(80));

  try {
    // Run the scrape
    log('🚀 Starting full scrape...');
    const session = await runFullScrape(autoApply);

    // Log results
    log('\n📊 SCRAPE RESULTS:');
    log(`Session ID: ${session.sessionId}`);
    log(`Status: ${session.status}`);
    log(`Start Time: ${session.startTime}`);
    log(`End Time: ${session.endTime || 'N/A'}`);
    log(`\nZIP Codes Scraped: ${session.zipCodesScraped.length}`);
    log(`  - ${session.zipCodesScraped.join(', ')}`);
    log(`\nPlans Found: ${session.totalPlansFound}`);
    log(`Unique Plans: ${session.uniquePlans}`);

    log('\n📈 CHANGES DETECTED:');
    log(`  New Plans: ${session.newPlans.length}`);
    log(`  Updated Plans: ${session.updatedPlans.length}`);
    log(`  Removed Plans: ${session.removedPlans.length}`);

    // Log new plans
    if (session.newPlans.length > 0) {
      log('\n✨ NEW PLANS:');
      session.newPlans.forEach((plan, i) => {
        log(`  ${i + 1}. ${plan.providerName} - ${plan.planName} (${plan.newRate?.toFixed(1)}¢)`);
      });
    }

    // Log updated plans
    if (session.updatedPlans.length > 0) {
      log('\n📝 UPDATED PLANS:');
      session.updatedPlans.forEach((plan, i) => {
        const change = (plan.newRate || 0) - (plan.oldRate || 0);
        const arrow = change > 0 ? '↑' : '↓';
        log(`  ${i + 1}. ${plan.providerName} - ${plan.planName}: ${plan.oldRate?.toFixed(1)}¢ ${arrow} ${plan.newRate?.toFixed(1)}¢ (${change > 0 ? '+' : ''}${change.toFixed(1)}¢)`);
      });
    }

    // Log removed plans
    if (session.removedPlans.length > 0) {
      log('\n❌ REMOVED PLANS:');
      session.removedPlans.forEach((plan, i) => {
        log(`  ${i + 1}. ${plan.providerName} - ${plan.planName} (was ${plan.oldRate?.toFixed(1)}¢)`);
      });
    }

    // Log errors
    if (session.errors.length > 0) {
      log('\n⚠️  ERRORS:');
      session.errors.forEach((error, i) => {
        log(`  ${i + 1}. ${error}`);
      });
    }

    // Summary
    log('\n' + '═'.repeat(80));
    if (session.status === 'completed') {
      log('✅ SCRAPE JOB COMPLETED SUCCESSFULLY');

      if (autoApply) {
        log(`Applied ${session.updatedPlans.length} updates and marked ${session.removedPlans.length} plans as inactive`);
        log(`${session.newPlans.length} new plans found (not auto-inserted - add manually via admin panel)`);
      } else {
        log('Preview mode - no changes were applied to the database');
        log('Run without --preview flag to apply changes automatically');
      }
    } else {
      log('❌ SCRAPE JOB FAILED');
      process.exit(1);
    }
    log('═'.repeat(80));

    // Optional: Send email summary (placeholder)
    // await sendEmailSummary(session);

  } catch (error) {
    log(`\n❌ FATAL ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    log('Stack trace:');
    if (error instanceof Error && error.stack) {
      log(error.stack);
    }
    log('═'.repeat(80));
    process.exit(1);
  }
}

/**
 * Send email summary (placeholder)
 * Implement with your preferred email service (SendGrid, AWS SES, etc.)
 */
async function sendEmailSummary(session: any): Promise<void> {
  // TODO: Implement email sending
  log('\n📧 Email summary: [Not implemented]');
  log('   To enable email notifications, implement sendEmailSummary() in scheduled-scrape.ts');

  // Example implementation with SendGrid:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: process.env.ADMIN_EMAIL,
    from: 'noreply@texaspowercompare.com',
    subject: `Scrape Results: ${session.newPlans.length} new, ${session.updatedPlans.length} updated`,
    html: generateEmailHtml(session),
  };

  await sgMail.send(msg);
  */
}

// Run the script
main();
