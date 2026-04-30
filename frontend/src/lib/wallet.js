/**
 * wallet.js — Multi-wallet abstraction layer
 *
 * Provides a unified API for connecting to Stellar wallets and signing
 * transactions. Supports Freighter, xBull, and Albedo.
 */
import { NETWORK_PASSPHRASE } from './stellar';

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

// ─── Connection Functions ───────────────────────────────────────────────────

/**
 * Connect to Freighter wallet.
 * @returns {Promise<string>} Public key
 */
async function connectFreighter() {
  const freighterApi = await import('@stellar/freighter-api');

  const isInstalled = await freighterApi.isConnected();
  if (!isInstalled) {
    throw new Error(
      'Freighter wallet is not installed. Please install the Freighter browser extension.'
    );
  }

  const result = await freighterApi.requestAccess();
  if (result.error) throw new Error(result.error);

  const address = typeof result === 'string' ? result : result.address;
  if (!address) {
    throw new Error('No address returned from Freighter.');
  }

  return address;
}

/**
 * Connect to xBull wallet.
 * @returns {Promise<string>} Public key
 */
async function connectXBull() {
  if (!window.xBullSDK) {
    throw new Error(
      'xBull Wallet is not installed. Please install the xBull browser extension.'
    );
  }

  const result = await window.xBullSDK.connect();
  if (!result?.publicKey) {
    throw new Error('Failed to get public key from xBull.');
  }

  return result.publicKey;
}

/**
 * Connect to Albedo wallet.
 * @returns {Promise<string>} Public key
 */
async function connectAlbedo() {
  if (!window.albedo) {
    throw new Error(
      'Albedo wallet is not available. Please visit albedo.link to use the web-based wallet.'
    );
  }

  const result = await window.albedo.publicKey({});
  if (!result?.pubkey) {
    throw new Error('Failed to get public key from Albedo.');
  }

  return result.pubkey;
}

// ─── Unified Connection ─────────────────────────────────────────────────────

/**
 * Connect to a wallet by ID.
 * @param {string} walletId - One of: 'freighter', 'xbull', 'albedo'
 * @returns {Promise<string>} Public key
 */
export async function connectWallet(walletId) {
  switch (walletId) {
    case 'freighter':
      return connectFreighter();
    case 'xbull':
      return connectXBull();
    case 'albedo':
      return connectAlbedo();
    default:
      throw new Error(`Unsupported wallet: ${walletId}`);
  }
}

// ─── Transaction Signing ────────────────────────────────────────────────────

/**
 * Sign a transaction XDR using the specified wallet.
 * @param {string} xdr      - Transaction XDR to sign
 * @param {string} walletId - Wallet that should sign
 * @returns {Promise<string>} Signed XDR
 */
export async function signTransaction(xdr, walletId) {
  switch (walletId) {
    case 'freighter': {
      const freighterApi = await import('@stellar/freighter-api');
      const signResult = await freighterApi.signTransaction(xdr, {
        network: 'TESTNET',
        networkPassphrase: NETWORK_PASSPHRASE,
      });

      if (typeof signResult === 'string') return signResult;
      if (signResult.signedTxXdr) return signResult.signedTxXdr;
      if (signResult.error) throw new Error(signResult.error);
      throw new Error('Transaction signing was rejected.');
    }

    case 'xbull': {
      if (!window.xBullSDK) throw new Error('xBull Wallet not available.');
      const result = await window.xBullSDK.signXDR(xdr, {
        network: 'TESTNET',
      });
      if (!result) throw new Error('xBull signing was rejected.');
      return result;
    }

    case 'albedo': {
      if (!window.albedo) throw new Error('Albedo not available.');
      const result = await window.albedo.tx({
        xdr,
        network: 'testnet',
      });
      if (!result?.signed_envelope_xdr) {
        throw new Error('Albedo signing was rejected.');
      }
      return result.signed_envelope_xdr;
    }

    default:
      throw new Error(`Unsupported wallet for signing: ${walletId}`);
  }
}
