Feature: Reporting a Found Pet

  Scenario: User reports a found pet
    Given the user is logged in the PetFinder application
    And the user is on the "Report Found Pet" page
    When the user fills out the found pet's information and location
    And the user submits the found pet report
    Then the system should save the found pet report
    And notify users who reported missing pets nearby
