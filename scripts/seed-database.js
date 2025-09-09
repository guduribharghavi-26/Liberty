// Run this script with: node scripts/seed-database.js
const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = "liberty_safety"

async function seedDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(dbName)

    // Create indexes
    await createIndexes(db)

    // Seed police stations
    await seedPoliceStations(db)

    // Seed demo police officer
    await seedDemoOfficer(db)

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

async function createIndexes(db) {
  console.log("Creating indexes...")

  // Users indexes
  await db.collection("users").createIndex({ email: 1 }, { unique: true })
  await db.collection("users").createIndex({ mobile: 1 }, { unique: true })
  await db.collection("users").createIndex({ role: 1 })

  // Incidents indexes
  await db.collection("incidents").createIndex({ case_number: 1 }, { unique: true })
  await db.collection("incidents").createIndex({ reporter_id: 1 })
  await db.collection("incidents").createIndex({ status: 1 })
  await db.collection("incidents").createIndex({ created_at: -1 })

  // Messages indexes
  await db.collection("messages").createIndex({ chat_room_id: 1 })
  await db.collection("messages").createIndex({ created_at: -1 })

  // Chat rooms indexes
  await db.collection("chat_rooms").createIndex({ user_id: 1 })
  await db.collection("chat_rooms").createIndex({ officer_id: 1 })

  // Notifications indexes
  await db.collection("notifications").createIndex({ user_id: 1 })
  await db.collection("notifications").createIndex({ created_at: -1 })

  console.log("Indexes created successfully")
}

async function seedPoliceStations(db) {
  console.log("Seeding police stations...")

  const policeStations = [
    {
      name: "Koramangala Police Station",
      address: "Koramangala, Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      phone: "+91-80-25532470",
      email: "koramangala.police@karnataka.gov.in",
      latitude: 12.9352,
      longitude: 77.6245,
      is_active: true,
      created_at: new Date(),
    },
    {
      name: "Whitefield Police Station",
      address: "Whitefield, Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      phone: "+91-80-28452301",
      email: "whitefield.police@karnataka.gov.in",
      latitude: 12.9698,
      longitude: 77.75,
      is_active: true,
      created_at: new Date(),
    },
    {
      name: "Indiranagar Police Station",
      address: "Indiranagar, Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      phone: "+91-80-25212020",
      email: "indiranagar.police@karnataka.gov.in",
      latitude: 12.9719,
      longitude: 77.6412,
      is_active: true,
      created_at: new Date(),
    },
    {
      name: "MG Road Police Station",
      address: "MG Road, Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      phone: "+91-80-25584242",
      email: "mgroad.police@karnataka.gov.in",
      latitude: 12.9716,
      longitude: 77.6197,
      is_active: true,
      created_at: new Date(),
    },
    {
      name: "Electronic City Police Station",
      address: "Electronic City, Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      phone: "+91-80-27835533",
      email: "ecity.police@karnataka.gov.in",
      latitude: 12.8456,
      longitude: 77.6603,
      is_active: true,
      created_at: new Date(),
    },
    // Delhi stations
    {
      name: "Connaught Place Police Station",
      address: "Connaught Place, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      phone: "+91-11-23412020",
      email: "cp.police@delhi.gov.in",
      latitude: 28.6315,
      longitude: 77.2167,
      is_active: true,
      created_at: new Date(),
    },
    {
      name: "Karol Bagh Police Station",
      address: "Karol Bagh, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      phone: "+91-11-25782020",
      email: "kb.police@delhi.gov.in",
      latitude: 28.6519,
      longitude: 77.1909,
      is_active: true,
      created_at: new Date(),
    },
    // Mumbai stations
    {
      name: "Bandra Police Station",
      address: "Bandra West, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      phone: "+91-22-26420020",
      email: "bandra.police@maharashtra.gov.in",
      latitude: 19.0596,
      longitude: 72.8295,
      is_active: true,
      created_at: new Date(),
    },
    {
      name: "Andheri Police Station",
      address: "Andheri West, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      phone: "+91-22-26730020",
      email: "andheri.police@maharashtra.gov.in",
      latitude: 19.1136,
      longitude: 72.8697,
      is_active: true,
      created_at: new Date(),
    },
  ]

  await db.collection("police_stations").insertMany(policeStations)
  console.log(`Inserted ${policeStations.length} police stations`)
}

async function seedDemoOfficer(db) {
  console.log("Creating demo police officer...")

  const bcrypt = require("bcryptjs")
  const passwordHash = await bcrypt.hash("password123", 12)

  const demoOfficer = {
    email: "officer.sharma@police.gov.in",
    mobile: "+919876543210",
    name: "Officer Rajesh Sharma",
    role: "police",
    password_hash: passwordHash,
    is_verified: true,
    state: "Karnataka",
    city: "Bangalore",
    badge_id: "KAR001",
    police_station: "Koramangala Police Station",
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
  }

  await db.collection("users").insertOne(demoOfficer)
  console.log("Demo police officer created")
}

// Run the seeding
seedDatabase()
