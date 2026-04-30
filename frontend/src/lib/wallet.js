/**
 * wallet.js — Multi-wallet abstraction layer
 *
 * Provides a unified API for connecting to Stellar wallets and signing
 * transactions. Supports Freighter, xBull, and Albedo using the official
 * StellarWalletsKit.
 */
import {
  StellarWalletsKit,
  Networks,
} from '@creit.tech/stellar-wallets-kit';
import { defaultModules } from '@creit.tech/stellar-wallets-kit/modules/utils';

// ─── Supported Wallets ──────────────────────────────────────────────────────
export const SUPPORTED_WALLETS = [
  {
    id: 'freighter',
    name: 'Freighter',
    description: 'Browser Extension Wallet',
    color: 'bg-blue-500',
    letter: 'F',
  },
  {
    id: 'xbull',
    name: 'xBull Wallet',
    description: 'Browser & PWA Wallet',
    color: 'bg-yellow-500 text-black',
    letter: 'xB',
  },
  {
    id: 'albedo',
    name: 'Albedo',
    description: 'Web-based Wallet',
    color: 'bg-green-500',
    letter: 'A',
  },
];

// Initialize the kit globally using the static init method (v2.x API)
StellarWalletsKit.init({
  network: Networks.TESTNET,
  selectedWalletId: 'freighter',
  modules: defaultModules(),
});

// ─── Unified Connection ─────────────────────────────────────────────────────

/**
 * Connect to a wallet by ID.
 * @param {string} walletId - One of: 'freighter', 'xbull', 'albedo'
 * @returns {Promise<string>} Public key
 */
export async function connectWallet(walletId) {
  StellarWalletsKit.setWallet(walletId);
  const { address } = await StellarWalletsKit.fetchAddress();
  if (!address) {
    throw new Error('No address returned from the wallet.');
  }
  return address;
}

// ─── Transaction Signing ────────────────────────────────────────────────────

/**
 * Sign a transaction XDR using the specified wallet.
 * @param {string} xdr      - Transaction XDR to sign
 * @param {string} walletId - Wallet that should sign
 * @returns {Promise<string>} Signed XDR
 */
export async function signTransaction(xdr, walletId) {
  StellarWalletsKit.setWallet(walletId);
  const result = await StellarWalletsKit.signTransaction(xdr, {
    networkPassphrase: Networks.TESTNET,
  });
  
  if (!result || !result.signedXDR) {
    throw new Error('Transaction signing was rejected or failed.');
  }
  
  return result.signedXDR;
}
