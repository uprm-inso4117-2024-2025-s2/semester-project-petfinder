import { Given, When, Then } from '@cucumber/cucumber';

Given('the user is logged into the PetFinder application', async function () {
  console.log('User is logged in');
});

Given('the user is on the {string} page', function (pageName) {
  console.log(`User is on page: ${pageName}`);
});

When('the user fills out the pets information and last known location', function () {
  console.log('Filling out pet information and last known location...');
});

When('the user submits the lost pet report', async function () {
  console.log('Submitting the lost pet report');
});

Then('the system should save the lost pet report', async function () {
  console.log('Checking if lost pet report is saved');
});

Then('notify users within the designated area', async function () {
  console.log('Checking if notifications are sent');
});
