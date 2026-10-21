Feature: End-to-end purchase
  As a shopper
  I want to purchase a product
  So that I can receive an order confirmation

  @test
  Scenario: Successful purchase from login to order confirmation
    Given I am on the SauceDemo login page
    When I log in with valid credentials
    Then I should see the inventory products
    When I sort products by price "low to high"
    And I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show 1 item
    When I open the cart
    Then I should see "Sauce Labs Backpack" in the cart
    When I start checkout
    Then checkout information should be displayed
    When I enter customer details "Ambrose" "Hastings" "A98XY12"
    And I continue checkout
    Then the checkout overview should show "Sauce Labs Backpack"
    When I finish checkout
    Then I should see the order confirmation
