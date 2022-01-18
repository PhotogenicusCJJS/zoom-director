const db = require('../server/models/databaseModels');

const COHORTS = 'cohorts'
const ROOMS = 'rooms'
const USERS = 'users'

const deleteTableContents = async (tableName) => {
  console.log(`deleting contents from ${tableName}`)
  
  const deleteQuery = `truncate ${tableName} cascade`;

  try {
    await db.query(deleteQuery);
  }
  catch(error) {
    console.log(error)
  }
}

const cohorts =  [
  {
    name: 'FITRI 5',
    number: 5
  },
  {
    name: 'FITRI 6',
    number: 6
  },
  {
    name: 'FITRI 7',
    number: 7
  }
]

const seedCohorts = async () => {
  console.log(`seeding '${COHORTS}' table`)

  const insertCohort = `INSERT INTO ${COHORTS} (name, number) VALUES ($1, $2)`;

  for(const cohort of cohorts) {
    const {name, number} = cohort

    try {
      await db.query(insertCohort, [name, number]);
    }
    catch(error) {
      console.log(error)
    }
  }

}

const urlPrefix = 'https://dummyimage.com/600x400/010328/ffffff&text=FTRI'

const extraJuniorRows = Array(12).fill(null).map((row, i) => {
  return {
    name: `FTRI Juniors ${i+1}`,
    zoomUrl: `${urlPrefix}+Juniors+${i+1}`
  }
})

const extraSeniorRows = Array(12).fill(null).map((row, i) => {
  return {
    name: `FTRI Seniors ${i+1}`,
    zoomUrl: `${urlPrefix}+Seniors+${i+1}`
  }
})

const rooms =  [
  {
    name: 'FTRI Juniors Main',
    zoomUrl: `${urlPrefix}+Juniors+Main`
  },
  {
    name: 'FTRI Seniors Main',
    zoomUrl: `${urlPrefix}+Seniors+Main`
  },
  {
    name: 'FTRI Runway',
    zoomUrl: `${urlPrefix}+Runway`
  },
  ...extraJuniorRows,
  ...extraSeniorRows,
]

const seedRooms = async () => {
  console.log(`seeding '${ROOMS}' table`)

  const insertRoom = `INSERT INTO ${ROOMS} (name, zoom_url) VALUES ($1, $2)`;

  for(const room of rooms ){
    const {name, zoomUrl} = room

    try {
      await db.query(insertRoom, [name, zoomUrl]);
    }
    catch(error) {
      console.log(error)
    }
  }
}

const sesameStreetNames = [
  "Abby Cadabby",
  "Telly",
  "Zoe",
  "Rosita", 
  "Mr. Snuffleupagus",
  "Bert",
  "Ernie",
  "Grover", 
  "Count von Count",
  "Oscar the Grouch",
  "Cookie Monster",
  "Big Bird",
  "Elmo",
]

const muppetNames = [
  "Kermit the Frog",
  "Miss Piggy",
  "Fozzie Bear",
  "Gonzo",
  "Rowlf the Dog",
  "Scooter",
  "Animal",
  "Pepe the King Prawn",
  "Rizzo the Rat",
  "Beaker",
  "Sam Eagle",
  "Swedish Chef",
  "Camilla the Chicken"
]

const fraggleNames = [
  "Red Fraggle",
  "Junior Gorg",
  "Uncle Traveling Matt",
  "Boober Fraggle",
  "Mokey Fraggle",
  "Wembley Fraggle",
  "Doc",
  "Ma Gorg",
  "Pa Gorg",
  "Gobo Fraggle",
  "Cave's Oldest Fraggle",
  "Aunt Granny Fraggle",
  "Chuchu Fraggle"
]

const nameLists = [ sesameStreetNames, muppetNames, fraggleNames]
const emailDomains = ['sesame.street', 'muppets.show', 'fraggle.rock']

const seedUsers = async () => {
  console.log(`seeding ${USERS} table`)

  const selectCohortIds = `SELECT id FROM ${COHORTS}`;
  let cohortIds = []

  try {
    const data = await db.query(selectCohortIds);
    cohortIds = data.rows.map(row => row.id)
  }
  catch(error) {
    console.log(error)
  }

  if(cohortIds.length < 1){
    console.log('You must create cohorts before creating users.')
    return
  }

  const insertUser = `INSERT INTO ${USERS} (first_name, last_name, email, cohort_id) VALUES ($1, $2, $3, $4)`;

  for(let i in nameLists){
    const nameList = nameLists[i]

    for(const name of nameList) {
      const urlSafeName = name.toLowerCase().replace(/[^A-Za-z0-9]/g, "")

      const email = `${urlSafeName}@${emailDomains[i]}`

      const cohortId = cohortIds[i]
  
      try {
        await db.query(insertUser, [name, ' ', email, cohortId]);
      }
      catch(error) {
        console.log(error)
      }
    }
  }
}

const seed = async () =>{
  await deleteTableContents(COHORTS)
  await seedCohorts()
  
  
  await deleteTableContents(ROOMS)
  await seedRooms()
  
  
  await deleteTableContents(USERS)
  await seedUsers()

  await db.end()
};

seed()