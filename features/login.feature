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

  @test
  Scenario Outline: Login rejects invalid credential combinations
    Given I am on the SauceDemo login page
    When I submit the "<case>" login case
    Then I should see the login error "<message>"
    Examples:
      | case             | message                                  |
      | invalid username | Username and password do not match      |
      | invalid password | Username and password do not match      |
      | empty username   | Username is required                    |
      | empty password   | Password is required                    |

  @test
  Scenario: Locked-out account cannot sign in
    Given I am on the SauceDemo login page
    When I log in with the locked-out user
    Then I should see the login error "Sorry, this user has been locked out."
