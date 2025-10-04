// SECURE ADMIN SETUP SCRIPT
// This script should ONLY be run server-side by authorized personnel
// Do NOT expose this to the public web interface

const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Initialize Firebase Admin (make sure this is configured)
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Creates the first admin user securely
 * This should only be run once by the system administrator
 */
async function createFirstAdmin() {
  try {
    const db = admin.firestore();
    
    // Check if any admin already exists
    const existingAdmins = await db.collection('admins').limit(1).get();
    if (!existingAdmins.empty) {
      console.log('❌ SECURITY: Admin users already exist. Cannot create additional admins via this script.');
      return false;
    }

    // Admin details to create
    const adminDetails = {
      email: 'admin@burjcode.com', // CHANGE THIS TO YOUR EMAIL
      password: 'TempPassword123!', // CHANGE THIS TO A SECURE PASSWORD
      fullName: 'System Administrator', // CHANGE THIS TO YOUR NAME
    };

    console.log('🔐 Creating first admin account...');
    console.log(`📧 Email: ${adminDetails.email}`);
    console.log(`👤 Name: ${adminDetails.fullName}`);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminDetails.email)) {
      console.log('❌ Invalid email format');
      return false;
    }

    // Password strength validation
    if (adminDetails.password.length < 8) {
      console.log('❌ Password must be at least 8 characters long');
      return false;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminDetails.password, 12);

    // Create admin user data
    const adminData = {
      email: adminDetails.email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      fullName: adminDetails.fullName,
      permissions: ['read', 'write', 'delete', 'admin'],
      authProvider: 'email',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save to Firestore
    const adminRef = await db.collection('admins').add(adminData);
    
    console.log('✅ Admin account created successfully!');
    console.log(`🆔 Admin ID: ${adminRef.id}`);
    console.log(`📧 Email: ${adminDetails.email}`);
    console.log(`🔑 Password: ${adminDetails.password}`);
    console.log('');
    console.log('🚨 SECURITY REMINDERS:');
    console.log('1. Change the password immediately after first login');
    console.log('2. Delete this script from production servers');
    console.log('3. Use strong, unique passwords');
    console.log('4. Enable 2FA if available');
    console.log('');
    console.log('🌐 Login at: http://localhost:3001/login');
    
    return true;

  } catch (error) {
    console.error('❌ Error creating admin:', error);
    return false;
  }
}

// Run the script
if (require.main === module) {
  createFirstAdmin().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

module.exports = { createFirstAdmin };
