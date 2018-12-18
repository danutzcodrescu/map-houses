import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { ApolloServer, gql } from "apollo-server-express";
import { Query } from "./resolvers/houses.resolvers";

// Load environment variables from .env file, where API keys and passwords
dotenv.config();

// Controllers (route handlers)

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URI;
mongoose
  .connect(
    mongoUrl,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch(err => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
  });

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Apollo graphql
const server = new ApolloServer({
  typeDefs: gql(fs.readFileSync(__dirname.concat("/schema.graphql"), "utf8")),
  resolvers: { Query },
  playground: process.env.NOD_ENV === "production" ? false : true,
  introspection: process.env.NOD_ENV === "production" ? false : true
});
server.applyMiddleware({
  app
  // cors: {
  //   origin: process.env.NOD_ENV === "development" ? "*" : process.env.FRONTEND
  // }
});

export default app;
