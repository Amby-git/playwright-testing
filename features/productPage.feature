@logged-in
Feature: Product details
  As a shopper
  I want to inspect a product before buying it
  So that I can confirm I selected the right item

  @test
  Scenario Outline: Each product page shows the selected product and its price
    When I open the product page for "<product>"
    Then I should see product details for "<product>" priced at "<price>"
    Examples:
      | product                                 | price  |
      | Sauce Labs Backpack                     | $29.99 |
      | Sauce Labs Bike Light                   | $9.99  |
      | Sauce Labs Bolt T-Shirt                 | $15.99 |
      | Sauce Labs Fleece Jacket                | $49.99 |
      | Sauce Labs Onesie                       | $7.99  |
      | Test.allTheThings() T-Shirt (Red)        | $15.99 |

  @test
  Scenario: The selected product page does not show another product's name
    When I open the product page for "Sauce Labs Backpack"
    Then the product page name should not be "Sauce Labs Bike Light"

  @test
  Scenario: A product can be added to the cart from its details page
    When I open the product page for "Sauce Labs Backpack"
    And I add the product to the cart from its details page
    Then the cart badge should show 1 item
