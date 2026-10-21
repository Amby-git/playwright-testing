Feature: SauceDemo login
  As a shopper
  I want to sign in
  So that I can browse products

  @test
  Scenario: Successful login
    Given I am on the SauceDemo login page
    When I log in with valid credentials
    Then I should see the inventory products

  @test
  Scenario: Invalid user name
    Given I am on the SauceDemo login page
    When I log in with an invalid username
    Then I should see the login error "Username and password do not match"

  @test
  Scenario: Invalid password
    Given I am on the SauceDemo login page
    When I log in with an invalid password
    Then I should see the login error "Username and password do not match"

  @test
  Scenario: Empty credentials
    Given I am on the SauceDemo login page
    When I submit empty login credentials
    Then I should see the login error "Username is required"
