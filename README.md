# Smart Account Starter

The smart account starter integrates multiple WaaS providers and smart account solutions into a single app.


# WaaS Providers

- [Privy](https://www.privy.io/)
- [Magic](https://magic.link/)
- [Dynamic](https://www.dynamic.xyz/)
- [Capsule](https://usecapsule.com/)

# Smart Account Solutions
- [Zerodev](https://zerodev.app/)
- [Safe](https://safe.global/)
- [Biconomy](https://www.biconomy.io/)
- [ERC7579](https://erc7579.com/)
- [Etherspot](https://www.etherspot.io/)
- [Thirdweb](https://thirdweb.com/)
- [Alchemy](https://www.alchemy.com/)
- [Stackup](https://stackup.sh/)
- [Pimlico](https://pimlico.io/)



# Exchange Wallets

- [OnchainKit (Coinbase)](https://www.coinbase.com/wallet)


# Apps and Packages

- `storefront`: the smart-account-starter [Next.js](https://nextjs.org/) app
- `api`: an [Express](https://expressjs.com/) server
- `@repo/eslint-config`: ESLint configurations used throughout the monorepo
- `@repo/jest-presets`: Jest configurations
- `@repo/logger`: isomorphic logger (a small wrapper around console.log)
- `@repo/ui`: a dummy React UI library (which contains `<CounterButton>` and `<Link>` components)
- `@repo/typescript-config`: tsconfig.json's used throughout the monorepo


# Contributing

We're using [Turborepo](https://turbo.build/repo/docs/core-concepts/monorepos) to manage this project.

install the dependencies

```bash
pnpm i
```

start the dev server

```bash
pnpm dev
```

copy the `.env.example` file to `.env` and set the correct environment variables

```bash
cp .env.example .env
```

<!-- LICENSE -->
## License

Distributed under the MIT License. See [`LICENSE.md`](LICENSE.md) for more information.

<!-- CONTACT -->
## Contact

cryptoB0T - fw0rl6z10@mozmail.com

Project Link: [https://github.com/smart-account-starter/smart-account-starter](https://github.com/smart-account-starter/smart-account-starter)

