Feature: Receiving Location-Based Notifications

  Scenario: User receives notification when near a lost pet location
    Given the user has enabled location-based notifications
    When the user moves within the radius of a lost pet report
    Then the system should send a notification about the nearby lost pet
