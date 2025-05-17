<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Table of Contents

- [Description](#introduction)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Project setup on codespace Github](#project-setup-on-codespace-github)
- [Deployment](#deployment)
- [Resources](#resources)
- [Contact Information](#contact-information)

## Description

Backend for a social networking application named **OnlyF**, designed for close friends to share memorable daily moments.  
The app is inspired by [Locket](https://www.locket.vn/).

- ✅ User registration, login, and authentication with JWT
- ✅ Account activation via email OTP
- ✅ Edit personal profile information
- ✅ Share friend invitation links
- ✅ Add and search friends by username
- ✅ Capture photos, record videos with captions for posts
- ✅ Reply to posts
- ✅ React to posts
- ✅ Share posts
- ✅ Real-time messaging with text, images, and videos
- ✅ Advertisement system
- ✅ Premium account top-up
- ✅ Notifications

## Demo

## Technologies Used

This project uses the following technologies

- Backend: Typescript, Nestjs framework
  <p align="left"> 
    <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> 
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="40" height="40"/>
    </a> 
  <a href="http://nestjs.com/" target="_blank" rel="noreferrer"> 
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg" width="40" height="40" />
    </a> 
  </p>
- Databases: PostgreSQL, Redis
  <p align="left"> 
  <a href="https://redis.io" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg" alt="redis" width="40" height="40"/> </a> 
  <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> 
  </a>
  </p>

- Other technologies: Github, Docker, Firebase
  <p align="left"> 
    <a href="https://git-scm.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="git" width="40" height="40"/> </a> 
    <a href="https://www.docker.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> </a> 
    <a href="https://firebase.google.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" alt="git" width="40" height="40"/> </a>   
  </a>
- Other services: Firebase, Cloudinary, Stripe
  <p align="left"> 
    <a href="https://firebase.google.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" width="40" height="40"/> </a> 
    <a href="https://cloudinary.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.brandfetch.io/idX0l-p4Rn/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B" width="40" height="40"/> </a> 
    <a href="https://stripe.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.brandfetch.io/idxAg10C0L/w/800/h/380/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B" height="40"/> </a> 
  </a>
</p>

## Project setup backend on codespace Github

### Create codespace

Fork repo -> Code -> choose options codespace -> run codespace

### Set up lib

```bash
$ npm install
```

### Create file `.env` like file `.env.example`

1. Firebase
   Create account [Firebase](https://firebase.google.com/)  
   Create new project  
   Project setting -> Service account -> Generate new private key -> download file and fill value to `.env`

2. Mail  
   Refer to the [video](https://youtu.be/xKP9UlINafM?si=VF4ZfWCbpUOA79mh)

3. Redis
   Free plan by [Upstash](https://console.upstash.com/login)
   Fill value from web to `.env`

4. Cloudinary  
   Free plan by [Cloudinary](https://cloudinary.com/)  
   Fill value from web to `.env`

5. Stripe  
   Free plan by [Stripe](<[https://cloudinary.com/](https://stripe.com/)>)  
   Fill value STRIPE_SECRET_KEY from web to `.env`  
   Search `webhook` -> Add destination -> Select event `checkout.session.completed` -> Endpoint URL `https://your.domaname.codespace/payment/webhook`  
   Fill value STRIPE_WEBHOOK_SECRET from web to `.env`

6. Firebase hosting  
   Set up refer [repo](https://github.com/ITAnh11/onlyf-mobile-hosting-firebase)  
   Fill value DOMAIN_FIREBASE_HOSTING from web to `.env`

### Set up Postgres

1. run docker

```bash
  $ docker compose up -d
```

2. create new terminal run server to gen database

```bash
$ npm run start:dev
```

3. unzip file database demo

```bash
$ unzip src/data/data.zip -d src/data/
```

4. import data to database

```bash
$ cat src/data/data.sql | docker exec -i postgres_onlyf psql -U admin -d onlyf
```

## Compile and run the project

1. run docker

```bash
$ docker compose up -d
```

2. run server

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

## Contact Information

If you have any questions, please contact via email: [buianhkc112004@gmail.com](mailto:buianhkc112004@gmail.com)
