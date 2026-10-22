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

  @test @logged-in
  Scenario Outline: Checkout reports each required customer detail
    When I add "<product>" to the cart
    And I open the cart
    And I start checkout
    When I enter customer details "<firstName>" "<lastName>" "<postalCode>"
    And I continue checkout
    Then I should see the checkout error "<error>"
    Examples:
      | product                 | firstName | lastName | postalCode | error                  |
      | Sauce Labs Backpack     |           |          |            | First Name is required |
      | Sauce Labs Bike Light   | Alex      |          | 90210      | Last Name is required  |
      | Sauce Labs Bolt T-Shirt | Alex      | Morgan   |            | Postal Code is required|

  @test @logged-in
  Scenario Outline: Different products can be purchased with customer data
    When I add "<product>" to the cart
    And I open the cart
    And I start checkout
    And I enter customer details "<firstName>" "<lastName>" "<postalCode>"
    And I continue checkout
    Then the checkout overview should show "<product>"
    When I finish checkout
    Then I should see the message "Thank you for your order!"
    Examples:
      | product                  | firstName | lastName | postalCode |
      | Sauce Labs Backpack      | Ada       | Lovelace | 10001      |
      | Sauce Labs Fleece Jacket | Grace     | Hopper   | 20002      |
