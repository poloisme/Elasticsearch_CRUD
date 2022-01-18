Feature: api

  Scenario: sign up passed
    Given I make a request signup to "http://localhost:3003/api/users/signup" with <data>
    When I receive a response signup passed 
    Then response signup passed should have a status code 200

    Examples:
      | data                                                                                       |
      | {"username": "username","password": "pass12345" ,"email": "email01@gmail.com","status": 1} |

  Scenario: sign up missing
    Given I make a request signup to "http://localhost:3003/api/users/signup" with <data>
    When I receive a response signup missing 1
    Then response signup missing 1 should have a status code 400

    Examples:
      | data                                                                |
      | {"password": "pass12345" ,"email": "email01@gmail.com","status": 1} |
  
  Scenario: sign up missing
    Given I make a request signup to "http://localhost:3003/api/users/signup" with <data>
    When I receive a response signup missing 2
    Then response signup missing 2 should have a status code 409

    Examples:
      | data                                                                                       |
      | {"username": "username","password": "pass12345" ,"email": "email01@gmail.com","status": 1} |

  
  Scenario: login passed
    Given I make a request login passed to "http://localhost:3003/api/users/login" with <data>
    When I receive a response login passed
    Then response login passed should have a status code 200

    Examples:
      | data                                             |
      | {"username": "username","password": "pass12345"} |

  Scenario: login missing
    Given I make a request login missing to "http://localhost:3003/api/users/login" with <data>
    When I receive a response login missing
    Then response login missing should have a status code 400

    Examples:
      | data                                        |
      | {"username": "username","password": "pass"} |

  Scenario: create passed
    Given I make a request create passed to "http://localhost:3003/api/users/create" with <data>
    When I receive a response create passed
    Then response create passed should have a status code 201

    Examples:
      | data                                                                                         |
      | {"username": "username01","password": "pass12345" ,"email": "email01@gmail.com","status": 1} |

  Scenario: create missing
    Given I make a request create missing 1 to "http://localhost:3003/api/users/create" with <data>
    When I receive a response create missing 1
    Then response create missing 1 should have a status code 400

    Examples:
      | data                                                               |
      | {"password": "pass12345" ,"email": "email01@gmail.com","status": 1} |

  Scenario: create missing
    Given I make a request create missing 2 to "http://localhost:3003/api/users/create" with <data>
    When I receive a response create missing 2
    Then response create missing 2 should have a status code 409

    Examples:
      | data                                                                                        |
      | {"username": "username", "password": "pass12345" ,"email": "email01@gmail.com","status": 1} |

  Scenario: get all user passed
    Given I make a request get all user passed to "http://localhost:3003/api/users"
    When I receive a response get all user passed
    Then response get all user passed should have a status code 200

  Scenario: get all user missing
    Given No data exist
    And I make a request get all user missing to "http://localhost:3003/api/users" 
    When I receive a response get all user missing
    Then response get all user missing should have a status code 404

  Scenario: get one user passed
    Given user id exist
    And I make a request get one user passed to "http://localhost:3003/api/users"
    When I receive a response get one user passed
    Then response get one user passed should have a status code 200

  Scenario: get one user missing
    Given user id not exist I make a request get one user missing to "http://localhost:3003/api/users"
    When I receive a response get one user missing
    Then response get one user missing should have a status code 404

  Scenario: update one user passed
    Given user id update exist
    And I make a request update one user passed to "http://localhost:3003/api/users" with <data>
    When I receive a response update one user passed
    Then response update one user passed should have a status code 200

  Examples:
      | data                                                                                        |
      | {"username": "usertest1", "password": "pass12345" ,"email": "email01@gmail.com","status": 1} |

  Scenario: update one user missing
    Given user id update not exist I make a request update one user missing to "http://localhost:3003/api/users" with <data>
    When I receive a response update one user missing
    Then response update one user missing should have a status code 404

  Examples:
      | data                                                                                        |
      | {"username": "usertest2", "password": "pass12345" ,"email": "email01@gmail.com","status": 1} |
  