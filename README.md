# auctionhouse
Real Time Bidding Web Application

### Prerequisites
The following is needed to be installed to run the application:
<li>JDK 17</li>
<li>MySQL</li>
<li>Maven</li>
<li>An IDE of your choice (we used Intellij IDEA)</li>

### Configuring the Database

Before starting the application you need to configure the mySQL Database, using the following commands.
```
CREATE DATABASE auction_db_;
CREATE USER 'auction_db_user_'@'localhost' IDENTIFIED BY '4UCTI!0N_#0u$E';
GRANT ALL PRIVILEGES ON auction_db_.* TO 'auction_db_user_'@'localhost';
```

In case you choose your own name/password for your Database and User, then you need to replace them in src/main/resources/application.properties

### Running the application

First we need to run the app, through our IDE, or by:
```
mvn spring-boot:run
```

Then we browse localhost:8080. The application starts with a prebuilt admin user with the following credentials:

username: admin@example.org
password: admin