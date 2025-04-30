import { Given, When, Then } from '@cucumber/cucumber';

Given('the user is logged in the PetFinder application', function () {
  console.log('User is logged in');
});


When('the user fills out the found pet\'s information and location', function () {
  console.log('Filling out found pet information and location...');
});

When('the user submits the found pet report', function () {
  console.log('Submitting found pet report...');
});

Then('the system should save the found pet report', function () {
  console.log('Checking if found pet report is saved...');
});

Then('notify users who reported missing pets nearby', function () {
  console.log('Notifying users about found pets nearby...');
});
