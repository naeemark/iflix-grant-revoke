# IFLIX_GRANT_REVOKE #

Demonstration of Requirements understanding, proposing a solution and implementation by using the latest tools and techniques. 

### What is this repository for? ###

* This app is built as assignment for iflix. 
* Adds different libs to enhance the application quality and performance.
* Version 1.0.0

### Problem Statement:
- [Provided as Instructions](INSTRUCTIONS.md)

### Development Cycle:
- Distributes the whole development into Issues
- Pleas visit the [ISSUES_PAGE](https://github.com/naeemark/iflix-grant-revoke/issues) for dev cycle


### Application Flow ###

- A: Parses the provided inputs from directory [data](/data)
- B: Iterates the `Users`
- C: Iterate each provider to find `grants` and `revocations` for each user
- D: Sorts `grants` and `revocations` by the `issuance date`
- E: Apply `grants` and `revocations` for each user
- F: Convert `User` to a `subscription`
- G: Write `subscriptions` object to [output file](/data/result.json)

## How do I get set up? ##

### How to set up ###
To set-up the project locally you need to clone this repo, from `master` or `develop` branch or some latest `TAG`

### Configuration ###

Please sync and resolve dependencies by using
- `npm install`

Set environment variables:
- `cp .env.example .env`

### Start App
- `npm run start`
OR
- `sh bin/run` (Installs dependencies first as a part of script)

### Test App
- `npm run test`
OR
- `sh bin/test` (Installs dependencies first as a part of script)

### Pre-reqs

- [nodejs](https://nodejs.org)
- [npm](www.npmjs.com/‎)

## Requirements ##

- See [`package.json`](/package.json)
- [JEST](https://jestjs.io)


## Major Libraries and tools included: ##

- Jest
- Winston
- Supertest
- joi

## Code Quality ##

- `Jest`
- `Istanbol Coverage`
- `SonarCloud`

## Distribution ##
- A git repository

## Deployment ##
- _TBD_

## Contribution guidelines ##

- Forks are always appreciated
