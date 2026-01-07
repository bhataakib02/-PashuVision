/**
 * Script to create an admin user in Supabase
 * 
 * Usage: node create-admin-user.js
 * 
 * This will prompt you for admin details and create the user
 */

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcrypt')
const { nanoid } = require('nanoid')
const readline = require('readline')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function createAdminUser() {
  console.log('🔐 Create Admin User')
  console.log('==================\n')

  try {
    const name = await question('Admin Name: ')
    const email = await question('Admin Email: ')
    const password = await question('Admin Password: ')
    const phone = await question('Phone (optional, press Enter to skip): ')

    if (!name || !email || !password) {
      console.error('❌ Name, email, and password are required')
      rl.close()
      return
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    if (existingUser) {
      console.error(`❌ User with email ${email} already exists`)
      rl.close()
      return
    }

    // Create admin user
    const userId = nanoid()
    const passwordHash = bcrypt.hashSync(password, 10)

    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email,
        password_hash: passwordHash,
        name: name,
        role: 'admin',
        phone: phone || null,
        is_active: true,
        permissions: ['all'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating admin user:', error.message)
      rl.close()
      return
    }

    console.log('\n✅ Admin user created successfully!')
    console.log(`   ID: ${data.id}`)
    console.log(`   Name: ${data.name}`)
    console.log(`   Email: ${data.email}`)
    console.log(`   Role: ${data.role}`)
    console.log('\n📝 You can now log in with this admin account')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    rl.close()
  }
}

createAdminUser()

