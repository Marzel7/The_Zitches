## What is this repo?

This is the code for the Zitches

At the moment it allows users to exchange tokens via a vending machine.

## Built with

- [React.js](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)

### Local Development Environment

**Note:** Make sure you have the latest version of node installed `^14.17.6`.

```bash
cd zitches;
nvm install; # to install the version in .nvmrc
```

1. Clone this repo with git
2. Install dependencies by running `yarn`
3. Start the development server with `yarn dev`
4. Open development site by going to `http:localhost:3000`

### Local Development Testing

1. Switch defaultNetwork: "hardhat" in hardhat.config.js
2. 'hh test'

### Local Deployment

1. Switch defaultNetwork: "localhost" in hardhat.config.js
2. 'hh run scripts/deploy.js'
