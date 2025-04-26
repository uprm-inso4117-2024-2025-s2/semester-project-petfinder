import { Given, When, Then } from '@cucumber/cucumber';

Given('the user has enabled location-based notifications', function () {
  console.log('User has enabled location-based notifications');
});

When('the user moves within the radius of a lost pet report', function () {
  console.log('User has entered radius of lost pet');
});

Then('the system should send a notification about the nearby lost pet', function () {
  console.log('Sending location-based lost pet notification...');
});
