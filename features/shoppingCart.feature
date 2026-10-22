@logged-in
Feature: SauceDemo inventory, cart, and checkout
  As a signed-in shopper
  I want to select and purchase products
  So that I can complete an order

  @test
  Scenario: Inventory products are displayed after login
    Then the product listing should be visible

  @test
  Scenario Outline: Products can be sorted by name
    When I sort products by name from "<direction>"
    Then products should be sorted by name from "<direction>"
    Examples:
      | direction |
      | A to Z    |
      | Z to A    |

  @test
  Scenario Outline: Products can be sorted by price
    When I sort products by price "<direction>"
    Then products should be sorted by price "<direction>"
    Examples:
      | direction  |
      | low to high |
      | high to low |

  @test
  Scenario: A product can be added and the badge shows its count
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show 1 item

  @test
  Scenario Outline: Different products can be added to the cart
    When I add "<product>" to the cart
    Then the cart badge should show 1 item
    When I open the cart
    Then I should see "<product>" in the cart

    Examples:
      | product                  |
      | Sauce Labs Backpack      |
      | Sauce Labs Bike Light    |
      | Sauce Labs Bolt T-Shirt  |
      | Sauce Labs Fleece Jacket |

  @test
  Scenario: Multiple products can be added to the cart together
    When I add the following products to the cart:
      | product                  |
      | Sauce Labs Backpack      |
      | Sauce Labs Bike Light    |
      | Sauce Labs Bolt T-Shirt  |
    Then the cart badge should show 3 item
    When I open the cart
    Then the cart should contain the following products:
      | product                 |
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
      | Sauce Labs Bolt T-Shirt |

  @test
  Scenario Outline: Different products can be removed from the inventory
    When I add "<product>" to the cart
    When I remove "<product>" from the inventory page
    Then the cart badge should show 0 item
    Examples:
      | product                  |
      | Sauce Labs Backpack      |
      | Sauce Labs Bike Light    |
      | Sauce Labs Bolt T-Shirt  |

  @test
  Scenario: A product can be removed from the inventory page
    When I add "Sauce Labs Backpack" to the cart
    And I remove "Sauce Labs Backpack" from the inventory page
    Then the cart badge should show 0 item

  @test
  Scenario: The cart can be opened and displays an added product
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    Then I should see "Sauce Labs Backpack" in the cart

  @test
  Scenario: A product can be removed from the cart
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    When I remove "Sauce Labs Backpack" from the cart
    Then the cart should be empty

  @test
  Scenario Outline: Different products can be removed from the cart
    When I add "<product>" to the cart
    And I open the cart
    When I remove "<product>" from the cart
    Then the cart should be empty
    Examples:
      | product                  |
      | Sauce Labs Backpack      |
      | Sauce Labs Bike Light    |
      | Sauce Labs Bolt T-Shirt  |

  @test
  Scenario: The cart is empty after removing its only product
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I remove "Sauce Labs Backpack" from the cart
    Then the cart should be empty
    And the cart badge should show 0 item

  @test
  Scenario: Checkout opens the customer information page
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I start checkout
    Then checkout information should be displayed

  @test
  Scenario: Checkout requires customer details
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I start checkout
    When I continue checkout without customer details
    Then I should see the checkout error "First Name is required"

  @test
  Scenario: Checkout can proceed with customer details
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I start checkout
    And I enter customer details "Ada" "Lovelace" "12345"
    When I continue checkout
    Then the checkout overview should be displayed

  @test
  Scenario: An order can be completed successfully
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I start checkout
    And I enter customer details "Ada" "Lovelace" "12345"
    And I continue checkout
    And I finish checkout
    Then I should see the order confirmation

  @test
  Scenario: The order confirmation message is displayed
    When I add "Sauce Labs Backpack" to the cart
    And I open the cart
    And I start checkout
    And I enter customer details "Ada" "Lovelace" "12345"
    And I continue checkout
    And I finish checkout
    Then I should see the message "Thank you for your order!"
