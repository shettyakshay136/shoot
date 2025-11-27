import shootService, { ShootData } from './services/shootService';

/**
 * Seed Database with Initial Dummy Data
 * This will populate Realm with the current dummy data from constants
 */

const AVAILABLE_SHOOTS: ShootData[] = [
  {
    shootId: 'available-1',
    title: 'Tech Product Launch',
    location: 'HITEC City, Hyderabad',
    date: 'Mon, Oct 2, 2025',
    duration: '4 hours',
    pay: '₹8,000',
    type: 'Photography',
    status: 'available',
    time: '10:00 AM',
    category: 'Product Photography',
    distance: '5 km',
    eta: '15 mins',
    shootHours: '4',
    reelsRequired: 'No',
    instantDelivery: 'Yes',
    description:
      'Professional product photography for a tech startup launching their new flagship device. High-quality images required for marketing materials.',
    addons: ['Drone shots', 'Professional editing'],
    songs: [],
  },
  {
    shootId: 'available-2',
    title: 'Fashion Brand Campaign',
    location: 'Banjara Hills, Hyderabad',
    date: 'Wed, Oct 4, 2025',
    duration: '6 hours',
    pay: '₹12,000',
    type: 'Videography',
    status: 'available',
    time: '9:00 AM',
    category: 'Fashion Videography',
    distance: '8 km',
    eta: '25 mins',
    shootHours: '6',
    reelsRequired: 'Yes',
    instantDelivery: 'No',
    description:
      'Create engaging video content for a fashion brand summer collection campaign. Multiple outfit changes and location shots required.',
    addons: ['Color grading', 'Motion graphics'],
    songs: [
      {
        title: 'Summer Vibes',
        artist: 'DJ Cool',
        thumbnail: '#FF6B6B',
      },
    ],
  },
  {
    shootId: 'available-3',
    title: 'Corporate Event',
    location: 'Financial District, Hyderabad',
    date: 'Fri, Oct 6, 2025',
    duration: '3 hours',
    pay: '₹6,000',
    type: 'Photography',
    status: 'available',
    time: '2:00 PM',
    category: 'Event Photography',
    distance: '12 km',
    eta: '30 mins',
    shootHours: '3',
    reelsRequired: 'No',
    instantDelivery: 'Yes',
    description:
      'Corporate annual meeting event coverage. Capture keynote speeches, networking sessions, and group photos.',
    addons: ['Same-day delivery'],
    songs: [],
  },
];

const UPCOMING_SHOOTS: ShootData[] = [
  {
    shootId: 'upcoming-1',
    title: 'Wedding Photography',
    location: 'HITEC City, Hyderabad',
    date: 'Fri, Sept 29, 2025',
    duration: '8 hours',
    pay: '₹15,000',
    type: 'Photography',
    status: 'upcoming',
    daysLeft: 3,
    time: '11:00 AM',
    category: 'Wedding Photography',
    distance: '7 km',
    eta: '20 mins',
    shootHours: '8',
    reelsRequired: 'No',
    instantDelivery: 'No',
    description:
      'Complete wedding day coverage including ceremony, reception, and couple portraits. Premium package with albums.',
    addons: ['Album design', 'Drone coverage', 'Second shooter'],
    songs: [],
  },
  {
    shootId: 'upcoming-2',
    title: 'Product Commercial',
    location: 'Gachibowli, Hyderabad',
    date: 'Sun, Oct 1, 2025',
    duration: '5 hours',
    pay: '₹10,000',
    type: 'Videography',
    status: 'upcoming',
    daysLeft: 5,
    time: '3:00 PM',
    category: 'Commercial Videography',
    distance: '10 km',
    eta: '28 mins',
    shootHours: '5',
    reelsRequired: 'Yes',
    instantDelivery: 'No',
    description:
      'Product commercial video for e-commerce platform. Multiple products to be showcased with creative shots.',
    addons: ['Professional lighting', 'Studio setup'],
    songs: [
      {
        title: 'Upbeat Energy',
        artist: 'Sound Studio',
        thumbnail: '#4ECDC4',
      },
      {
        title: 'Modern Flow',
        artist: 'Beat Makers',
        thumbnail: '#FFE66D',
      },
    ],
  },
];

const COMPLETED_SHOOTS: ShootData[] = [
  {
    shootId: 'completed-1',
    title: 'Corporate Headshots',
    location: 'Banjara Hills, Hyderabad',
    date: 'Mon, Sept 25, 2025',
    duration: '2 hours',
    pay: '₹4,000',
    type: 'Photography',
    status: 'completed',
    earnings: '₹4,000',
    rating: 4.8,
    time: '1:00 PM',
    category: 'Corporate Photography',
    description:
      'Professional headshots for company website and LinkedIn profiles. Clean, professional look required.',
  },
  {
    shootId: 'completed-2',
    title: 'Event Coverage',
    location: 'Financial District, Hyderabad',
    date: 'Wed, Sept 20, 2025',
    duration: '4 hours',
    pay: '₹7,000',
    type: 'Photography',
    status: 'completed',
    earnings: '₹7,000',
    rating: 4.9,
    time: '6:00 PM',
    category: 'Event Photography',
    description:
      'Corporate event with panel discussions and networking. Captured key moments and candid shots.',
  },
];

const REJECTED_SHOOTS: ShootData[] = [
  {
    shootId: 'rejected-1',
    title: 'Fashion Editorial',
    location: 'Jubilee Hills, Hyderabad',
    date: 'Thu, Sept 28, 2025',
    duration: '6 hours',
    pay: '₹9,000',
    type: 'Photography',
    status: 'rejected',
    time: '12:00 PM',
    category: 'Fashion Photography',
    description:
      'Editorial fashion shoot for magazine feature. Creative styling and artistic direction required.',
  },
  {
    shootId: 'rejected-2',
    title: 'Music Video',
    location: 'Kondapur, Hyderabad',
    date: 'Sat, Sept 30, 2025',
    duration: '10 hours',
    pay: '₹18,000',
    type: 'Videography',
    status: 'rejected',
    time: '8:00 AM',
    category: 'Music Video',
    description:
      'Music video production for independent artist. Multiple locations and creative camera work needed.',
  },
];

/**
 * Seeds the database with initial dummy data
 * Call this once when app first launches or after database reset
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('\n🌱 [Seed] ========== STARTING DATABASE SEED ==========');
    console.log('🌱 [Seed] Preparing dummy data...');

    const allShoots = [
      ...AVAILABLE_SHOOTS,
      ...UPCOMING_SHOOTS,
      ...COMPLETED_SHOOTS,
      ...REJECTED_SHOOTS,
    ];

    console.log(`🌱 [Seed] Total shoots to seed: ${allShoots.length}`);
    console.log(`   🟢 Available: ${AVAILABLE_SHOOTS.length}`);
    console.log(`   🟡 Upcoming: ${UPCOMING_SHOOTS.length}`);
    console.log(`   🟣 Completed: ${COMPLETED_SHOOTS.length}`);
    console.log(`   🔴 Rejected: ${REJECTED_SHOOTS.length}`);

    await shootService.saveShoots(allShoots);

    // Seed user performance data
    console.log('\n🌱 [Seed] Saving user performance data...');
    await shootService.saveUserPerformance('user-1', '10', '4.8');
    console.log('🌱 [Seed] User performance: shoots=10, ratings=4.8');

    console.log(
      '\n✅ [Seed] ========== DATABASE SEEDED SUCCESSFULLY ==========\n',
    );
  } catch (error) {
    console.error('[Seed] Failed to seed database:', error);
    throw error;
  }
};

/**
 * Check if database needs seeding
 * Returns true if database is empty
 */
export const needsSeeding = async (): Promise<boolean> => {
  try {
    console.log('\n🔍 [Seed] Checking if database needs seeding...');
    const shoots = await shootService.getAllShoots();
    const needsSeed = shoots.length === 0;
    console.log(
      `🔍 [Seed] Database has ${shoots.length} shoots, needs seeding: ${needsSeed}`,
    );
    return needsSeed;
  } catch (error) {
    console.error('❌ [Seed] Error checking if seeding needed:', error);
    return true;
  }
};
