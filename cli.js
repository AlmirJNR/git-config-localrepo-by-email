#! /usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';

const answer = await inquirer.prompt([
  {
    type: 'list',
    message: 'Which user do you want to config?',
    name: 'cli',
    choices: ['personal GitHub', 'pluritech GitLab'],
  }
]);

try {
  const stdout = execSync('gpg --list-secret-keys --keyid-format=long').toString();

  const matches = stdout.matchAll(/\<(.*)\>/g);
  let current = matches.next();

  const emails = [];

  while (current.value) {
    if (current.value) {
      emails.push(current.value[1]);
    }
    current = matches.next();
  }

  if (answer.cli === 'personal GitHub') {
    const email = emails[0];
    execSync(`git config user.email "${email}"`);

    console.log('git user.email is set to ' + chalk.greenBright(email));

  } else if (answer.cli === 'pluritech GitLab') {
    const email = emails[1];
    execSync(`git config user.email "${email}"`);
    console.log('git user.email is set to ' + chalk.greenBright(email));
  }
} catch (error) {
  console.error(error.toString());
};
