# Using localStorage to make and maintain the database

## Context and Problem Statement

How should we store the data that the user saves?
How much data is expected to be saved by users?

## Considered Formats to Store Data

* JSON
* SQLite
* localStorage

## Decision Outcome

Chosen option: localStorage

Using localStorage allows us to use built in features to accomplish our functionality without adding complexity. It gets rid of the
need to include dependencies. It will also save us time because we will not have to worry about the learning curve that comes with
using a tool that most of the team is unfamiliar with. 
