Event Website Project 10

This project is an Event website with basic functionalities. The database was created with Mongo Atlas and the server with EXPRESS. The Front end was created with Javascript Vanilla . It is a simulation of a website that is used to attend, create and know about events, also to generate a network of contacts.

## Technologies

- Node.js
- javaScript
- mongoDB
  -Vite

## Dependencies

- Nodemon
- express
- dotenv
- mongoose
- puppeteer
- bcrypt
- cloudinary
- cors
- multer
- multer-storage-cloudinary

## Website URL

Two seeds were injected into the database, 10 events and 10 users. These can be injected back into the database using the following commands:

npm run "seedEvents" for events
npm run "seedUsers" for users

##### important

For site verification purposes. In the user seed, a fictitious user was injected with the following characteristics:

name: Kelly Slater
password: 123

This user has among its fields the role of admin, so it can change the role of the other users, besides being able to delete other users and delete events. Only users with admin role can delete other users and events that were not created by them.
