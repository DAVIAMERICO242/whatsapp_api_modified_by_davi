const app = require('./src/app')
const { baseWebhookURL } = require('./src/config')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./databases/whatsapp_robusto.sql')

const createusersTABLE = `
    CREATE TABLE users (
        user VARCHAR(50) PRIMARY KEY,
        pass VARCHAR(50)
    );
`;

const createAllowed_tokensTABLE = `
    CREATE TABLE allowed_tokens (
        token VARCHAR(50) PRIMARY KEY
    );
`;

const createToken_to_session_idTABLE = `
    CREATE TABLE token_to_session_id (
        token VARCHAR(50),
        session_id VARCHAR(50),
        FOREIGN KEY (token) REFERENCES allowed_tokens(token)
    );
`;


db.serialize(() => {
  db.run(createusersTABLE, (err) => {
      if (err) {
          console.error('A tabela ja existe (erro ignoravel):', err.message);
      } else {
          console.log('Table created successfully');
      }

      // Close the database connection
  });
});

db.serialize(() => {
    db.run(createAllowed_tokensTABLE, (err) => {
        if (err) {
            console.error('A tabela ja existe (erro ignoravel):', err.message);
        } else {
            console.log('Table created successfully');
        }

        // Close the database connection
    });
});

db.serialize(() => {
  db.run(createToken_to_session_idTABLE, (err) => {
      if (err) {
          console.error('A tabela ja existe (erro ignoravel):', err.message);
      } else {
          console.log('Table created successfully');
      }

      // Close the database connection
  });
});


require('dotenv').config()

// Start the server
const port = process.env.PORT || 3000

// Check if BASE_WEBHOOK_URL environment variable is available
if (!baseWebhookURL) {
  console.error('BASE_WEBHOOK_URL environment variable is not available. Exiting...')
  process.exit(1) // Terminate the application with an error code
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
