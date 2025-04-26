Feature: Reporting a Lost Pet

  Scenario: User reports a lost pet
    Given the user is logged into the PetFinder application
    And the user is on the "Report Lost Pet" page
    When the user fills out the pets information and last known location
    And the user submits the lost pet report
    Then the system should save the lost pet report
    And notify users within the designated area
