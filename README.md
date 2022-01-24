# Cards Against Humanity

1. [Overview](#Overview)

2. [Installation](#Installation)
   
   1. [via Nodejs](#via%20Nodejs)
   
   2. [via Docker](#via%20Docker)

3. [Resources](#Resources)

## Overview

It's a Cards Against Humanity, so what would you expect?

But this cards against humanity is build with NodeJS and socket.io.

## Installation

### via%20Nodejs

Make sure NodeJS is installed

```shell
# node --version
vxx.xx
# npm --version
xx.xx
```

if it's not installed, than install it

- clone this repository
- run npm i
- you can set the environment variable "PORT" to a specific port. (if not manually set the default port is 3000)
- run npm run start

### via Docker

Install docker if not installed [Guide to install docker](https://docs.docker.com/get-docker/)

```shell
# docker run -p 127.0.0.1:80:8080/tcp mero702/cah
```

## Resources

The card pack is from https://crhallberg.com/cah/
