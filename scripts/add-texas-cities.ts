import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface CityData {
  name: string;
  slug: string;
  county: string;
  population: number;
  region: string;
  rateModifier: number; // percentage modifier (e.g., 5 for +5%, -3 for -3%)
}

// Base rates (Dallas region baseline)
const BASE_RATES = {
  rate_500: 14.2,
  rate_1000: 12.8,
  rate_2000: 11.5,
};

// Regional rate modifiers
const REGIONAL_MODIFIERS = {
  houston: 5, // +5%
  dallas: 0, // base
  austin: 3, // +3%
  sanAntonio: 5, // +5%
  westTexas: -3, // -3%
  panhandle: -5, // -5%
  other: 0,
};

// Comprehensive list of 250+ Texas cities by region
const cities: CityData[] = [
  // HOUSTON METRO AREA (Gulf Coast region)
  { name: 'Houston', slug: 'houston', county: 'Harris', population: 2314000, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Pasadena', slug: 'pasadena', county: 'Harris', population: 151950, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Pearland', slug: 'pearland', county: 'Brazoria', population: 131448, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'League City', slug: 'league-city', county: 'Galveston', population: 114392, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Sugar Land', slug: 'sugar-land', county: 'Fort Bend', population: 111026, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Missouri City', slug: 'missouri-city', county: 'Fort Bend', population: 74259, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Baytown', slug: 'baytown', county: 'Harris', population: 83701, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Conroe', slug: 'conroe', county: 'Montgomery', population: 98081, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'The Woodlands', slug: 'the-woodlands', county: 'Montgomery', population: 114436, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Galveston', slug: 'galveston', county: 'Galveston', population: 53219, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Katy', slug: 'katy', county: 'Harris', population: 21926, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Humble', slug: 'humble', county: 'Harris', population: 16795, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Friendswood', slug: 'friendswood', county: 'Galveston', population: 41213, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Kingwood', slug: 'kingwood', county: 'Harris', population: 71500, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Spring', slug: 'spring', county: 'Harris', population: 62559, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Cypress', slug: 'cypress', county: 'Harris', population: 165000, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Rosenberg', slug: 'rosenberg', county: 'Fort Bend', population: 38282, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Stafford', slug: 'stafford', county: 'Fort Bend', population: 17824, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Deer Park', slug: 'deer-park', county: 'Harris', population: 34495, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'La Porte', slug: 'la-porte', county: 'Harris', population: 35124, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Texas City', slug: 'texas-city', county: 'Galveston', population: 51898, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Richmond', slug: 'richmond', county: 'Fort Bend', population: 12534, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Webster', slug: 'webster', county: 'Harris', population: 11229, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Seabrook', slug: 'seabrook', county: 'Harris', population: 13618, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Tomball', slug: 'tomball', county: 'Harris', population: 12947, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Magnolia', slug: 'magnolia', county: 'Montgomery', population: 2072, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Alvin', slug: 'alvin', county: 'Brazoria', population: 27098, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Angleton', slug: 'angleton', county: 'Brazoria', population: 19371, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Santa Fe', slug: 'santa-fe', county: 'Galveston', population: 13439, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Dickinson', slug: 'dickinson', county: 'Galveston', population: 20847, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },

  // DALLAS-FORT WORTH METROPLEX
  { name: 'Dallas', slug: 'dallas', county: 'Dallas', population: 1304000, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Fort Worth', slug: 'fort-worth', county: 'Tarrant', population: 978000, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Arlington', slug: 'arlington', county: 'Tarrant', population: 394602, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Plano', slug: 'plano', county: 'Collin', population: 285494, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Irving', slug: 'irving', county: 'Dallas', population: 256684, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Garland', slug: 'garland', county: 'Dallas', population: 246018, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Frisco', slug: 'frisco', county: 'Collin', population: 214253, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'McKinney', slug: 'mckinney', county: 'Collin', population: 207507, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Grand Prairie', slug: 'grand-prairie', county: 'Dallas', population: 201843, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Mesquite', slug: 'mesquite', county: 'Dallas', population: 150108, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Carrollton', slug: 'carrollton', county: 'Dallas', population: 139248, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Denton', slug: 'denton', county: 'Denton', population: 148143, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Richardson', slug: 'richardson', county: 'Dallas', population: 120981, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Lewisville', slug: 'lewisville', county: 'Denton', population: 116010, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Allen', slug: 'allen', county: 'Collin', population: 105623, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Flower Mound', slug: 'flower-mound', county: 'Denton', population: 78854, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Mansfield', slug: 'mansfield', county: 'Tarrant', population: 73989, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Euless', slug: 'euless', county: 'Tarrant', population: 61032, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Grapevine', slug: 'grapevine', county: 'Tarrant', population: 55469, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Bedford', slug: 'bedford', county: 'Tarrant', population: 49477, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Hurst', slug: 'hurst', county: 'Tarrant', population: 40413, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Coppell', slug: 'coppell', county: 'Dallas', population: 42134, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'The Colony', slug: 'the-colony', county: 'Denton', population: 45190, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Little Elm', slug: 'little-elm', county: 'Denton', population: 51042, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Wylie', slug: 'wylie', county: 'Collin', population: 57526, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Rockwall', slug: 'rockwall', county: 'Rockwall', population: 47251, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'DeSoto', slug: 'desoto', county: 'Dallas', population: 55180, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Cedar Hill', slug: 'cedar-hill', county: 'Dallas', population: 48337, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Duncanville', slug: 'duncanville', county: 'Dallas', population: 38524, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Rowlett', slug: 'rowlett', county: 'Dallas', population: 65426, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Farmers Branch', slug: 'farmers-branch', county: 'Dallas', population: 35991, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Watauga', slug: 'watauga', county: 'Tarrant', population: 24854, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Keller', slug: 'keller', county: 'Tarrant', population: 49303, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Southlake', slug: 'southlake', county: 'Tarrant', population: 31684, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Colleyville', slug: 'colleyville', county: 'Tarrant', population: 26766, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'North Richland Hills', slug: 'north-richland-hills', county: 'Tarrant', population: 71763, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Haltom City', slug: 'haltom-city', county: 'Tarrant', population: 44300, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Burleson', slug: 'burleson', county: 'Johnson', population: 51618, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Cleburne', slug: 'cleburne', county: 'Johnson', population: 31352, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Waxahachie', slug: 'waxahachie', county: 'Ellis', population: 41140, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Lancaster', slug: 'lancaster', county: 'Dallas', population: 41275, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Midlothian', slug: 'midlothian', county: 'Ellis', population: 35611, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Sachse', slug: 'sachse', county: 'Dallas', population: 27892, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Prosper', slug: 'prosper', county: 'Collin', population: 30174, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Celina', slug: 'celina', county: 'Collin', population: 16739, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Anna', slug: 'anna', county: 'Collin', population: 15560, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Murphy', slug: 'murphy', county: 'Collin', population: 21013, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },

  // AUSTIN METRO AREA
  { name: 'Austin', slug: 'austin', county: 'Travis', population: 979882, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Round Rock', slug: 'round-rock', county: 'Williamson', population: 136122, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Cedar Park', slug: 'cedar-park', county: 'Williamson', population: 77595, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Georgetown', slug: 'georgetown', county: 'Williamson', population: 75420, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Pflugerville', slug: 'pflugerville', county: 'Travis', population: 70791, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Leander', slug: 'leander', county: 'Williamson', population: 68611, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'San Marcos', slug: 'san-marcos', county: 'Hays', population: 67553, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Buda', slug: 'buda', county: 'Hays', population: 17717, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Kyle', slug: 'kyle', county: 'Hays', population: 51877, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Hutto', slug: 'hutto', county: 'Williamson', population: 31334, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Lakeway', slug: 'lakeway', county: 'Travis', population: 20558, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Bee Cave', slug: 'bee-cave', county: 'Travis', population: 7847, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Bastrop', slug: 'bastrop', county: 'Bastrop', population: 9688, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Lockhart', slug: 'lockhart', county: 'Caldwell', population: 14379, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Dripping Springs', slug: 'dripping-springs', county: 'Hays', population: 5037, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Marble Falls', slug: 'marble-falls', county: 'Burnet', population: 7164, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Taylor', slug: 'taylor', county: 'Williamson', population: 17291, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },

  // SAN ANTONIO METRO AREA
  { name: 'San Antonio', slug: 'san-antonio', county: 'Bexar', population: 1495000, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'New Braunfels', slug: 'new-braunfels', county: 'Comal', population: 104707, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Schertz', slug: 'schertz', county: 'Guadalupe', population: 42433, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Seguin', slug: 'seguin', county: 'Guadalupe', population: 30929, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Converse', slug: 'converse', county: 'Bexar', population: 29156, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Universal City', slug: 'universal-city', county: 'Bexar', population: 20691, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Cibolo', slug: 'cibolo', county: 'Guadalupe', population: 32276, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Live Oak', slug: 'live-oak', county: 'Bexar', population: 15492, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Boerne', slug: 'boerne', county: 'Kendall', population: 19385, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Selma', slug: 'selma', county: 'Guadalupe', population: 11928, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Helotes', slug: 'helotes', county: 'Bexar', population: 10069, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Canyon Lake', slug: 'canyon-lake', county: 'Comal', population: 30320, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Bulverde', slug: 'bulverde', county: 'Comal', population: 6277, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },

  // EL PASO & WEST TEXAS
  { name: 'El Paso', slug: 'el-paso', county: 'El Paso', population: 678815, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },
  { name: 'Socorro', slug: 'socorro', county: 'El Paso', population: 35929, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },
  { name: 'Horizon City', slug: 'horizon-city', county: 'El Paso', population: 21170, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },
  { name: 'Midland', slug: 'midland', county: 'Midland', population: 146038, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },
  { name: 'Odessa', slug: 'odessa', county: 'Ector', population: 117625, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },
  { name: 'San Angelo', slug: 'san-angelo', county: 'Tom Green', population: 101004, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },
  { name: 'Abilene', slug: 'abilene', county: 'Taylor', population: 127428, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },
  { name: 'Big Spring', slug: 'big-spring', county: 'Howard', population: 27282, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },
  { name: 'Pecos', slug: 'pecos', county: 'Reeves', population: 12916, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },
  { name: 'Fort Stockton', slug: 'fort-stockton', county: 'Pecos', population: 8466, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },
  { name: 'Alpine', slug: 'alpine', county: 'Brewster', population: 6035, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },

  // LUBBOCK & PANHANDLE
  { name: 'Lubbock', slug: 'lubbock', county: 'Lubbock', population: 266878, region: 'panhandle', rateModifier: REGIONAL_MODIFIERS.panhandle },
  { name: 'Amarillo', slug: 'amarillo', county: 'Potter', population: 201234, region: 'panhandle', rateModifier: REGIONAL_MODIFIERS.panhandle },
  { name: 'Wichita Falls', slug: 'wichita-falls', county: 'Wichita', population: 102316, region: 'panhandle', rateModifier: REGIONAL_MODIFIERS.panhandle },
  { name: 'Canyon', slug: 'canyon', county: 'Randall', population: 15722, region: 'panhandle', rateModifier: REGIONAL_MODIFIERS.panhandle },
  { name: 'Pampa', slug: 'pampa', county: 'Gray', population: 16686, region: 'panhandle', rateModifier: REGIONAL_MODIFIERS.panhandle },
  { name: 'Borger', slug: 'borger', county: 'Hutchinson', population: 12551, region: 'panhandle', rateModifier: REGIONAL_MODIFIERS.panhandle },
  { name: 'Plainview', slug: 'plainview', county: 'Hale', population: 19699, region: 'panhandle', rateModifier: REGIONAL_MODIFIERS.panhandle },
  { name: 'Levelland', slug: 'levelland', county: 'Hockley', population: 14134, region: 'panhandle', rateModifier: REGIONAL_MODIFIERS.panhandle },
  { name: 'Hereford', slug: 'hereford', county: 'Deaf Smith', population: 14726, region: 'panhandle', rateModifier: REGIONAL_MODIFIERS.panhandle },
  { name: 'Dumas', slug: 'dumas', county: 'Moore', population: 14630, region: 'panhandle', rateModifier: REGIONAL_MODIFIERS.panhandle },

  // CORPUS CHRISTI & COASTAL BEND
  { name: 'Corpus Christi', slug: 'corpus-christi', county: 'Nueces', population: 317863, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Laredo', slug: 'laredo', county: 'Webb', population: 255205, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Brownsville', slug: 'brownsville', county: 'Cameron', population: 186738, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'McAllen', slug: 'mcallen', county: 'Hidalgo', population: 143268, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Edinburg', slug: 'edinburg', county: 'Hidalgo', population: 101170, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Pharr', slug: 'pharr', county: 'Hidalgo', population: 79112, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Mission', slug: 'mission', county: 'Hidalgo', population: 84331, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Harlingen', slug: 'harlingen', county: 'Cameron', population: 71658, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Victoria', slug: 'victoria', county: 'Victoria', population: 66674, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Port Arthur', slug: 'port-arthur', county: 'Jefferson', population: 54705, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Beaumont', slug: 'beaumont', county: 'Jefferson', population: 115282, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Orange', slug: 'orange', county: 'Orange', population: 18595, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Port Neches', slug: 'port-neches', county: 'Jefferson', population: 12729, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Nederland', slug: 'nederland', county: 'Jefferson', population: 17547, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Groves', slug: 'groves', county: 'Jefferson', population: 15588, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },

  // OTHER MAJOR CITIES & REGIONS
  { name: 'Tyler', slug: 'tyler', county: 'Smith', population: 108312, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Longview', slug: 'longview', county: 'Gregg', population: 81521, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Killeen', slug: 'killeen', county: 'Bell', population: 156129, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Temple', slug: 'temple', county: 'Bell', population: 82073, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Waco', slug: 'waco', county: 'McLennan', population: 144816, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Bryan', slug: 'bryan', county: 'Brazos', population: 87255, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'College Station', slug: 'college-station', county: 'Brazos', population: 120511, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Texarkana', slug: 'texarkana', county: 'Bowie', population: 36193, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Lufkin', slug: 'lufkin', county: 'Angelina', population: 35021, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Nacogdoches', slug: 'nacogdoches', county: 'Nacogdoches', population: 32147, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Sherman', slug: 'sherman', county: 'Grayson', population: 43259, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Denison', slug: 'denison', county: 'Grayson', population: 24851, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Greenville', slug: 'greenville', county: 'Hunt', population: 28164, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Paris', slug: 'paris', county: 'Lamar', population: 24905, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Corsicana', slug: 'corsicana', county: 'Navarro', population: 23770, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Marshall', slug: 'marshall', county: 'Harrison', population: 23392, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Huntsville', slug: 'huntsville', county: 'Walker', population: 45941, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Del Rio', slug: 'del-rio', county: 'Val Verde', population: 34673, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Eagle Pass', slug: 'eagle-pass', county: 'Maverick', population: 28525, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Uvalde', slug: 'uvalde', county: 'Uvalde', population: 15217, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Kerrville', slug: 'kerrville', county: 'Kerr', population: 24278, region: 'sanAntonio', rateModifier: REGIONAL_MODIFIERS.sanAntonio },
  { name: 'Fredericksburg', slug: 'fredericksburg', county: 'Gillespie', population: 11355, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Port Lavaca', slug: 'port-lavaca', county: 'Calhoun', population: 12035, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Bay City', slug: 'bay-city', county: 'Matagorda', population: 17424, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Alice', slug: 'alice', county: 'Jim Wells', population: 17891, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Kingsville', slug: 'kingsville', county: 'Kleberg', population: 25402, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Beeville', slug: 'beeville', county: 'Bee', population: 13195, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Snyder', slug: 'snyder', county: 'Scurry', population: 11125, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },
  { name: 'Sweetwater', slug: 'sweetwater', county: 'Nolan', population: 10702, region: 'westTexas', rateModifier: REGIONAL_MODIFIERS.westTexas },
  { name: 'Stephenville', slug: 'stephenville', county: 'Erath', population: 21814, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Brownwood', slug: 'brownwood', county: 'Brown', population: 18813, region: 'austin', rateModifier: REGIONAL_MODIFIERS.austin },
  { name: 'Mineral Wells', slug: 'mineral-wells', county: 'Palo Pinto', population: 14868, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Weatherford', slug: 'weatherford', county: 'Parker', population: 34150, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Granbury', slug: 'granbury', county: 'Hood', population: 11159, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Ennis', slug: 'ennis', county: 'Ellis', population: 20562, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Terrell', slug: 'terrell', county: 'Kaufman', population: 19509, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Gainesville', slug: 'gainesville', county: 'Cooke', population: 17394, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Bonham', slug: 'bonham', county: 'Fannin', population: 10408, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Sulphur Springs', slug: 'sulphur-springs', county: 'Hopkins', population: 16521, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Mount Pleasant', slug: 'mount-pleasant', county: 'Titus', population: 16331, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Jacksonville', slug: 'jacksonville', county: 'Cherokee', population: 14544, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Palestine', slug: 'palestine', county: 'Anderson', population: 17906, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Athens', slug: 'athens', county: 'Henderson', population: 12857, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Kaufman', slug: 'kaufman', county: 'Kaufman', population: 7801, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Forney', slug: 'forney', county: 'Kaufman', population: 23455, region: 'dallas', rateModifier: REGIONAL_MODIFIERS.dallas },
  { name: 'Rockport', slug: 'rockport', county: 'Aransas', population: 10756, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Aransas Pass', slug: 'aransas-pass', county: 'San Patricio', population: 8204, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Portland', slug: 'portland', county: 'San Patricio', population: 20385, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Robstown', slug: 'robstown', county: 'Nueces', population: 11217, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Mercedes', slug: 'mercedes', county: 'Hidalgo', population: 15993, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Weslaco', slug: 'weslaco', county: 'Hidalgo', population: 41103, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Donna', slug: 'donna', county: 'Hidalgo', population: 16320, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'San Benito', slug: 'san-benito', county: 'Cameron', population: 24259, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Los Fresnos', slug: 'los-fresnos', county: 'Cameron', population: 7667, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'La Feria', slug: 'la-feria', county: 'Cameron', population: 7302, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Rio Grande City', slug: 'rio-grande-city', county: 'Starr', population: 14690, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
  { name: 'Roma', slug: 'roma', county: 'Starr', population: 11433, region: 'houston', rateModifier: REGIONAL_MODIFIERS.houston },
];

// Calculate rates based on base rates and regional modifier
function calculateRates(rateModifier: number) {
  const multiplier = 1 + rateModifier / 100;
  return {
    rate_500: parseFloat((BASE_RATES.rate_500 * multiplier).toFixed(2)),
    rate_1000: parseFloat((BASE_RATES.rate_1000 * multiplier).toFixed(2)),
    rate_2000: parseFloat((BASE_RATES.rate_2000 * multiplier).toFixed(2)),
  };
}

// Generate SEO-optimized metadata
function generateMetadata(city: CityData) {
  const { name, county, population } = city;
  const popStr = population >= 1000000
    ? `${(population / 1000000).toFixed(1)}M`
    : population >= 1000
    ? `${Math.round(population / 1000)}K`
    : population.toString();

  return {
    meta_title: `${name} Electricity Rates | Compare ${name} TX Energy Plans 2024`,
    meta_description: `Compare electricity rates in ${name}, Texas (${county} County, pop. ${popStr}). Find the best energy plans and save on your electric bill. Free comparison tool.`,
  };
}

async function addCities() {
  console.log(`Starting to add ${cities.length} Texas cities to the database...\n`);

  let added = 0;
  let skipped = 0;
  let errors = 0;

  for (const city of cities) {
    try {
      // Check if city already exists by slug
      const { data: existing, error: checkError } = await supabase
        .from('cities')
        .select('slug')
        .eq('slug', city.slug)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" - any other error is a problem
        console.error(`❌ Error checking ${city.name}:`, checkError.message);
        errors++;
        continue;
      }

      if (existing) {
        console.log(`⏭️  Skipping ${city.name} - already exists`);
        skipped++;
        continue;
      }

      // Calculate rates with regional modifier
      const rates = calculateRates(city.rateModifier);
      const metadata = generateMetadata(city);

      // Insert the city
      const { error: insertError } = await supabase.from('cities').insert({
        name: city.name,
        slug: city.slug,
        county: city.county,
        population: city.population,
        average_rate_500: rates.rate_500,
        average_rate_1000: rates.rate_1000,
        average_rate_2000: rates.rate_2000,
        meta_title: metadata.meta_title,
        meta_description: metadata.meta_description,
      });

      if (insertError) {
        console.error(`❌ Error adding ${city.name}:`, insertError.message);
        errors++;
      } else {
        console.log(
          `✅ Added ${city.name} (${city.county} County, pop. ${city.population.toLocaleString()}) - Region: ${city.region}, Rates: $${rates.rate_500}/$${rates.rate_1000}/$${rates.rate_2000}`
        );
        added++;
      }
    } catch (error) {
      console.error(`❌ Unexpected error with ${city.name}:`, error);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('Summary:');
  console.log(`✅ Added: ${added} cities`);
  console.log(`⏭️  Skipped: ${skipped} cities (already existed)`);
  console.log(`❌ Errors: ${errors} cities`);
  console.log(`📊 Total processed: ${cities.length} cities`);
  console.log('='.repeat(80));
}

// Run the script
addCities()
  .then(() => {
    console.log('\n✨ City import complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
