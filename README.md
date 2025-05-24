<!-- <p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p> -->

<h1 align="center" >
  OnlyFriend
</h1>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">
  <a href="#" target="_blank">
    <img src="https://img.shields.io/badge/Onlyf-v1.0.0-ff69b4" alt="Onlyf Version" />
  </a>
  <a href="#" target="_blank">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  </a>
  <a href="#" target="_blank">
    <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status" />
  </a>
  <a href="#" target="_blank">
    <img src="https://img.shields.io/badge/coverage-90%25-yellowgreen" alt="Coverage" />
  </a>
  <a href="https://discord.gg/gCV5HQAv" target="_blank">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289da" alt="Discord" />
  </a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Table of Contents

- [Description](#introduction)
- [All related repos](#all-related-repos)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Project setup on codespace Github](#project-setup-on-codespace-github)
- [Deployment](#deployment)
- [Resources](#resources)
- [Contact Information](#contact-information)

## Description

Frontend app android for a social networking application named **OnlyF**, designed for close friends to share memorable daily moments.  
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

## All related repos

- [Frontend-mobile](https://github.com/ITAnh11/onlyf-mobile)
- [Backend](https://github.com/ITAnh11/onlyf-backend)
- [Generate data](https://github.com/ITAnh11/generate_data_onlyf)
- [Firebase hosting](https://github.com/ITAnh11/onlyf-mobile-hosting-firebase)

## Demo

## Technologies Used

This project uses the following technologies

- App: Typescript, React Native, Expo
  <p align="left"> 
    <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> 
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="40" height="40"/>
    </a> 
     <a href="http://nestjs.com/" target="_blank" rel="noreferrer"> 
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="40" height="40" />
    </a> 
    <a href="https://expo.dev/" target="_blank" rel="noreferrer" > 
            <img alt="logo-wordmark-light" src="https://github.com/user-attachments/assets/ff17bd44-c432-475c-b2b3-7d9bb79b00bf" height="36" />
    </a> 
  </p>

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
- Other services: Firebase, Cloudinary, Stripe, Google Admob
  <p align="left"> 
    <a href="https://firebase.google.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" width="40" height="40"/> </a> 
    <a href="https://cloudinary.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.brandfetch.io/idX0l-p4Rn/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B" width="40" height="40"/> </a> 
    <a href="https://stripe.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.brandfetch.io/idxAg10C0L/w/800/h/380/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B" height="40"/> </a> 
    <a href="https://admob.google.com/intl/vi/home/" target="_blank" rel="noreferrer"> <img src="https://img.icons8.com/?size=100&id=J3caGozFXTk1&format=png&color=000000" height="40"/> </a> 
  </a>
</p>

## Project setup on codespace Github

### Create codespace

Fork repo -> Code -> choose options codespace -> run codespace

Or clone to local

```bash
$ git clone https://github.com/ITAnh11/onlyf-backend.git
```

If you run on local you need use [Ngrok](https://ngrok.com/) to public url

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
   Free plan by [Stripe](https://stripe.com/)  
   Fill value STRIPE_SECRET_KEY from web to `.env`  
   Search `webhook` -> Add destination -> Select event `checkout.session.completed` -> Endpoint URL `https://your.server.url/payment/webhook`  
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

3. Public port 3000 on codespace

## Project setup frontend at repo

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
