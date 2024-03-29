# Cards Against Humanity

1. [Overview](#Overview)

2. [Demo](#Demo)

3. [TODOs](#TODOs)

4. [Installation](#Installation)
   
   1. [via Nodejs](#via-Nodejs)
   
   2. [via Docker](#via-Docker)

5. [Resources](#Resources)

## Overview

It's a Cards Against Humanity, so what would you expect?

But this cards against humanity is build with NodeJS and socket.io.

## Demo
[Show Demo](https://cah.if-loop.mywire.org)

## TODOs

* Mobile Version
* PWA 
* SEO Optimation
* Google Listing
* Google Analytics

## Installation

### via Nodejs

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
# docker run -p 127.0.0.1:80:8080/tcp mero702/cah:stable
```

For reference [https://hub.docker.com/r/mero702/cah](https://hub.docker.com/r/mero702/cah)

## Resources

The card pack is from https://crhallberg.com/cah/
