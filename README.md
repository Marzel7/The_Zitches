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
2. Install dependencies by running `npm i`
3. Start the development server with `npm run start`
4. Open development site by going to `http:localhost:3000`

### Local Development Testing

1. Switch defaultNetwork: "hardhat" in hardhat.config.js
2. 'hh test'

### Local Deployment

1. Switch defaultNetwork: "localhost" in hardhat.config.js
2. `hh node` - run instance of hardhat local chain
3. `hh run scripts/deploy.js`- deploy contracts on localhost

### Rinkeby deployment

To deploy to Rinkeby, these are the steps:

1. `hh run scripts/deploy.js --network rinkeby`

```

```

Working example deployed, you'll need to have your wallet connected to Metamask
`https://rhetorical-cloud.surge.sh`
