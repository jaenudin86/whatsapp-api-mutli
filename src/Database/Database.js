const mysql = require('mysql2')
const sdb8 =  require('mssql')
// const db = mysql.createConnection({
//     host: '192.168.10.12',
//     user: 'wa',
//     password: 'pfind@sqlserver',
//     database: 'i-whatsapp'
// })
const db = mysql.createPool({
    host: '192.168.10.12',
    user: 'wa',
    password: 'pfind@sqlserver',
    database: 'i-whatsapp',
    waitForConnections: true,
    connectionLimit: 100000,
    maxIdle: 1000000, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 6000000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  })
const sqlConfig = {
    user: 'sa',
    password: 'voksel@16',
    database: 'dbKantin',
    server: '192.168.9.14',
    options: {
        encrypt: false, // for azure
        trustServerCertificate: false // change to true for local dev / self-signed certs
      }


  }
// db.connect((err) => {
//     if (err)
//     {
//         throw err
//     }
//     else
//     {
//     console.log('database terhubung.')
//     }
// })
sdb8.connect(sqlConfig, err => {

    if (err)
    {
         throw err
    }
    else
    {
    console.log('database terhubung MTSQ.')
    }
})

// module.exports = {
//     { db, sdb8}
//   }

  module.exports = {
    db,sdb8
  }