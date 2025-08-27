// create-user.ts
// Run with: npx ts-node create-user.ts
// Or: node create-user.js (rename file first)

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser(userData) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: hashedPassword,
        jobTitle: userData.jobTitle || 'Test User',
        isActive: true,
        isApprover: userData.isApprover || false,
        globalAccess: userData.globalAccess || 5,
        emailVerified: new Date(),
      }
    });
    
    console.log(`✅ User created successfully!`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Password: ${userData.password}`);
    console.log(`   Name: ${userData.firstName} ${userData.lastName}`);
    console.log(`   User ID: ${user.id}`);
    console.log(`   Is Approver: ${user.isApprover}`);
    console.log('');
    
    return user;
  } catch (error) {
    if (error.code === 'P2002') {
      console.log(`⚠️  User already exists: ${userData.email}`);
    } else {
      console.error('Error creating user:', error);
    }
    return null;
  }
}

async function main() {
  console.log('🔧 Creating test users for MTM-MS application...\n');
  
  // Create admin user
  await createUser({
    email: 'admin@test.com',
    firstName: 'Admin',
    lastName: 'User',
    password: 'admin123',
    jobTitle: 'System Administrator',
    isApprover: true,
    globalAccess: 1, // Highest access level
  });
  
  // Create regular user
  await createUser({
    email: 'user@test.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'user123',
    jobTitle: 'Quality Analyst',
    isApprover: false,
    globalAccess: 3, // Medium access level
  });
  
  // Create approver user
  await createUser({
    email: 'approver@test.com',
    firstName: 'Jane',
    lastName: 'Smith',
    password: 'approver123',
    jobTitle: 'Quality Manager',
    isApprover: true,
    globalAccess: 2, // High access level
  });
  
  console.log('✨ Test users setup complete!');
  console.log('\n📝 Login credentials:');
  console.log('────────────────────────────────────────');
  console.log('Admin:    admin@test.com / admin123');
  console.log('User:     user@test.com / user123');
  console.log('Approver: approver@test.com / approver123');
  console.log('────────────────────────────────────────');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
