const getGoogleSecrets = require('./bin/secret');
const { exec } = require('child_process');

/**
 *
 */
async function runMigration() {
  await getGoogleSecrets();

  const command = 'npx sequelize-cli db:migrate';
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      // return;
    }
    console.log(`Stdout: ${stdout}`);
  });
}

runMigration();
