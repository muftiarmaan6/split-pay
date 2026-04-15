import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit/sdk";
import { defaultModules } from '@creit-tech/stellar-wallets-kit/modules/utils';

export const kit = StellarWalletsKit.init({
  modules: defaultModules(),
});
