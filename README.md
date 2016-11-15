# Misty

World of Warcraft guild on Magtheridon EU

[View on Battle.net](http://eu.battle.net/wow/en/guild/magtheridon/Misty/)

You're welcome to fork this repository and create your own World of Warcraft guild website based on this template. It's incredibly easy to modify and use

## Prerequisites

1. [Git](http://git-scm.com/)
2. [Node.js](http://nodejs.org/) (with NPM)

## Start

1. `npm install`
2. `npm start`

## Scripts

There's a few included Node scripts to help you setup your website

### Guild

Gets your guild roster from the World of Warcraft Armory

#### Usage

	npm run guild -- <args>

Sample usage

	npm run guild -- --name Misty --realm Magtheridon --server EU --ranks 0 1 2 --leadership 0 --portraits --pretty

View all options by passing `--help`

	npm run guild -- --help
