const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const bip39 = require('bip39');
const readlineSync = require('readline-sync');
const fs = require('fs');
const moment = require('moment');
require('colors');

async function createCosmosAccount() {
  const mnemonic = bip39.generateMnemonic();
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
  const [{ address }] = await wallet.getAccounts();

  return { address, mnemonic };
}

async function main() {
  try {
    let totalWallets = readlineSync.question(
      'Input how many wallets you want to generate: '.yellow
    );

    totalWallets = parseInt(totalWallets);
    if (isNaN(totalWallets) || totalWallets < 1) {
      throw new Error('Invalid number of wallets. Please enter a number > 0.');
    }

    for (let i = 0; i < totalWallets; i++) {
      const { address, mnemonic } = await createCosmosAccount();

      try {
        fs.appendFileSync(
          './result.txt',
          `Address: ${address} | Mnemonic: ${mnemonic}\n`
        );
      } catch (fsError) {
        throw new Error(
          'Failed to write to result.txt. Please check file permissions.'
        );
      }

      console.log(
        `[${moment().format('HH:mm:ss')}] Wallet created! Address: ${address}`
          .green
      );
    }

    console.log(
      'All wallets have been created. Check result.txt for the details.'.green
    );
  } catch (error) {
    console.error('An error occurred:'.red, error.message);
  }
}

main().catch((error) => {
  console.error(error.message.red);
});
