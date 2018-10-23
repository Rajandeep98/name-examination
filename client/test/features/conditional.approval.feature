Feature: Conditional approval

Scenario: Joe can approve a request with a condition
    Given INSURANCE is a restricted word requiring consent with instructions: double check please
    Given Joe has an INPROGRESS assigned name request NR1111 with name INSURANCE & Co INC
    Given Joe accesses Name examination
    Given he accesses conditions tab
    Given he selects the first condition on INSURANCE

    When he goes to Decision screen
    Then he sees the selected condition about INSURANCE - double check please

    When he approves NR1111
    Then he sees that NR1111 is now APPROVED