const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testRegistration() {
  try {
    console.log('Testing user registration process...');
    
    // Test data
    const testUser = {
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword123'
    };

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testUser.email }
    });

    if (existingUser) {
      console.log('✅ Test user already exists, skipping creation');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testUser.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: testUser.email,
        username: testUser.username,
        name: testUser.name,
        hashedPassword
      }
    });

    console.log('✅ Test user created successfully:', {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name
    });

  } catch (error) {
    console.error('❌ Registration test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRegistration();
