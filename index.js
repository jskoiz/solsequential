import dotenv from 'dotenv';
import bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair, Connection } from '@solana/web3.js';
import fs from 'fs';
import fastcsv from 'fast-csv';

dotenv.config();

function deriveSolanaKeypair(mnemonic, derivationPath) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
    return Keypair.fromSeed(derivedSeed.slice(0, 32));
}

async function checkActivityForAddress(connection, publicKey) {
    try {
        const transactions = await connection.getConfirmedSignaturesForAddress2(publicKey);
        return transactions.length > 0;
    } catch (error) {
        console.error(`Error checking activity for address ${publicKey}: ${error.message}`);
        return false;
    }
}

async function generateSolanaAddresses() {
    const mnemonic = process.env.MNEMONIC;
    if (!mnemonic || !bip39.validateMnemonic(mnemonic)) {
        console.error('Invalid or no mnemonic provided in .env file.');
        process.exit(1);
    }

    const numberOfAddresses = 10; // Adjust this to generate the desired number of addresses
    const addressData = [];
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const delayBetweenRequests = 1000; // 1 second delay

    for (let walletIndex = 0; walletIndex < numberOfAddresses; walletIndex++) {
        try {
            const path = `m/44'/501'/${walletIndex}'/0'`;
            const keypair = deriveSolanaKeypair(mnemonic, path);
            const address = keypair.publicKey.toString();

            await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));

            const hasActivity = await checkActivityForAddress(connection, keypair.publicKey);

            addressData.push({ path, address, hasActivity });
        } catch (error) {
            console.error(`Error with path m/44'/501'/${walletIndex}'/0': ${error.message}`);
        }
    }

    for (let j = 0; j < numberOfAddresses; j++) {
        try {
            const path = `m/44'/501'/${j}'`;
            const keypair = deriveSolanaKeypair(mnemonic, path);
            const address = keypair.publicKey.toString();

            await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));

            const hasActivity = await checkActivityForAddress(connection, keypair.publicKey);

            addressData.push({ path, address, hasActivity });
        } catch (error) {
            console.error(`Error with path m/44'/501'/${j}': ${error.message}`);
        }
    }

    return addressData;
}

async function main() {
    const addressData = await generateSolanaAddresses();

    const csvStream = fastcsv.format({ headers: true });
    const writableStream = fs.createWriteStream('solana_addresses.csv');

    csvStream.pipe(writableStream);
    addressData.forEach(data => csvStream.write(data));
    csvStream.end();

    writableStream.on('finish', () => console.log('Addresses have been written to solana_addresses.csv'));
    writableStream.on('error', err => console.error(err));
}

main().catch(console.error);
