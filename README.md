//on hr use curl or simply run the tests in the IDE they have

GET request

curl http://localhost:8080/products

-X method
-H headers
-d data

POST request for JSON
curl -X POST -H "Content-Type: application/json" -d '{"_id": "006", "name": "My shampoo"}' http://localhost:8080/products/create

DELETE request
curl -X Delete http://localhost:8080/products/delete/006
