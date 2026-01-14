-- ============================================================================
-- Texas Power Comparison - Initial Schema Migration
-- ============================================================================
-- This migration creates the core tables for the Texas Power Comparison app
-- Created: 2026-01-12
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Table: providers
-- Description: Electricity providers/companies in Texas
-- ============================================================================
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    website TEXT,
    phone TEXT,
    rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on slug for fast lookups by slug
CREATE INDEX idx_providers_slug ON providers(slug);

-- ============================================================================
-- Table: plans
-- Description: Electricity plans offered by providers
-- ============================================================================
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('Fixed', 'Variable', 'Prepaid')),
    contract_length_months INTEGER NOT NULL CHECK (contract_length_months >= 0),
    renewable_percentage INTEGER NOT NULL CHECK (renewable_percentage >= 0 AND renewable_percentage <= 100),
    rate_500kwh NUMERIC(5,2) NOT NULL CHECK (rate_500kwh >= 0),
    rate_1000kwh NUMERIC(5,2) NOT NULL CHECK (rate_1000kwh >= 0),
    rate_2000kwh NUMERIC(5,2) NOT NULL CHECK (rate_2000kwh >= 0),
    base_charge NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (base_charge >= 0),
    early_termination_fee NUMERIC(6,2) CHECK (early_termination_fee >= 0),
    features JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on provider_id for fast lookups of plans by provider
CREATE INDEX idx_plans_provider_id ON plans(provider_id);

-- Index on is_active for filtering active plans
CREATE INDEX idx_plans_is_active ON plans(is_active);

-- Composite index for common queries (active plans by provider)
CREATE INDEX idx_plans_provider_active ON plans(provider_id, is_active);

-- ============================================================================
-- Table: zip_coverage
-- Description: Geographic coverage mapping for plans by ZIP code
-- ============================================================================
CREATE TABLE zip_coverage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    zip_code TEXT NOT NULL,
    utility_provider TEXT,
    city TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on zip_code for fast lookups by ZIP code (most common query)
CREATE INDEX idx_zip_coverage_zip_code ON zip_coverage(zip_code);

-- Index on plan_id for fast lookups of coverage by plan
CREATE INDEX idx_zip_coverage_plan_id ON zip_coverage(plan_id);

-- Composite index for common queries (plans available in a ZIP code)
CREATE INDEX idx_zip_coverage_zip_plan ON zip_coverage(zip_code, plan_id);

-- Unique constraint to prevent duplicate plan-zip combinations
CREATE UNIQUE INDEX idx_zip_coverage_unique ON zip_coverage(plan_id, zip_code);

-- ============================================================================
-- Table: cities
-- Description: Texas cities with average electricity rates and metadata
-- ============================================================================
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    county TEXT,
    population INTEGER CHECK (population >= 0),
    average_rate_500 NUMERIC(5,2) CHECK (average_rate_500 >= 0),
    average_rate_1000 NUMERIC(5,2) CHECK (average_rate_1000 >= 0),
    average_rate_2000 NUMERIC(5,2) CHECK (average_rate_2000 >= 0),
    meta_title TEXT,
    meta_description TEXT
);

-- Index on slug for fast lookups by slug
CREATE INDEX idx_cities_slug ON cities(slug);

-- Index on name for search functionality
CREATE INDEX idx_cities_name ON cities(name);

-- ============================================================================
-- Function: Update updated_at timestamp
-- Description: Automatically updates the updated_at column on row changes
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on plans table
CREATE TRIGGER trigger_plans_updated_at
    BEFORE UPDATE ON plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments for documentation
-- ============================================================================
COMMENT ON TABLE providers IS 'Electricity providers/companies operating in Texas';
COMMENT ON TABLE plans IS 'Electricity plans offered by providers with pricing tiers';
COMMENT ON TABLE zip_coverage IS 'Geographic coverage mapping for plans by ZIP code';
COMMENT ON TABLE cities IS 'Texas cities with average rates and SEO metadata';

COMMENT ON COLUMN plans.rate_500kwh IS 'Rate in cents per kWh for 500 kWh monthly usage';
COMMENT ON COLUMN plans.rate_1000kwh IS 'Rate in cents per kWh for 1000 kWh monthly usage';
COMMENT ON COLUMN plans.rate_2000kwh IS 'Rate in cents per kWh for 2000 kWh monthly usage';
COMMENT ON COLUMN plans.renewable_percentage IS 'Percentage of renewable energy (0-100)';
COMMENT ON COLUMN plans.features IS 'Additional plan features stored as JSON';
