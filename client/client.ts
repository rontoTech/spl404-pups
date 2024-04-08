import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  getAccount,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import {
  keypairIdentity,
  token,
  Metaplex,
  toBigNumber,
} from "@metaplex-foundation/js";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import type { Spl404 } from "../target/types/spl404";

// Configure the client to use the local cluster
anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.Spl404 as anchor.Program<Spl404>;

const mintAuthority = program.provider.wallet.payer;

const decimals = 6;

let [tokenAccountOwnerPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_account_owner_pda")],
  program.programId
);

const metaplex = new Metaplex(program.provider.connection).use(
  keypairIdentity(program.provider.wallet.payer)
);
const mintDecimals = Math.pow(10, decimals);

const createdSFT = await metaplex.nfts().createSft({
  uri: "https://shdw-drive.genesysgo.net/AzjHvXgqUJortnr5fXDG2aPkp2PfFMvu4Egr57fdiite/PirateCoinMeta",
  name: "Pupulation",
  symbol: "$PUPS",
  sellerFeeBasisPoints: 100,
  updateAuthority: mintAuthority,
  mintAuthority: mintAuthority,
  decimals: decimals,
  tokenStandard: TokenStandard.Fungible,
  isMutable: true,
});

console.log(
  "Creating semi fungible spl token with address: " + createdSFT.sft.address
);

let mintResult = await metaplex.nfts().mint({
  nftOrSft: createdSFT.sft,
  authority: program.provider.wallet.payer,
  toOwner: program.provider.wallet.payer.publicKey,
  amount: token(8100 * mintDecimals),
});

console.log("Mint to result: " + mintResult.response.signature);

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  program.provider.connection,
  program.provider.wallet.payer,
  createdSFT.mintAddress,
  program.provider.wallet.payer.publicKey
);

console.log("tokenAccount: " + tokenAccount.address);
console.log("TokenAccountOwnerPda: " + tokenAccountOwnerPda);

const { nft } = await metaplex.nfts().create({
  uri: "https://easyweb3.ai/json/1.json",
  name: "Pupulation NFTs",
  symbol: "$PUPS-NFTs",
  sellerFeeBasisPoints: 100,
  updateAuthority: mintAuthority,
  mintAuthority: mintAuthority,
  tokenStandard: TokenStandard.NonFungible,
  mintTokens: true,
  maxSupply: toBigNumber(8100),
  isCollection: false,
  isMutable: true,
});

let res = await metaplex.nfts().printNewEdition({ originalMint: nft.address });

console.log(res);

/*

let minting = await metaplex.nfts().mint({
  nftOrSft: nft,
  authority: program.provider.wallet.payer,
  toOwner: program.provider.wallet.payer.publicKey,
  amount: token(1),
});

console.log(minting);

const tokenAccount1 = await getOrCreateAssociatedTokenAccount(
  program.provider.connection,
  program.provider.wallet.payer,
  nft.address,
  program.provider.wallet.payer.publicKey
);

console.log(tokenAccount1);

/*
let tokenAccountInfo = await getAccount(program.provider.connection, tokenAccount.address);
console.log(
  "Owned token amount: " + tokenAccountInfo.amount / BigInt(mintDecimals)
);
let [tokenVault] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_vault"), createdSFT.mintAddress.toBuffer()],
  program.programId
);
console.log("VaultAccount: " + tokenVault);

let confirmOptions = {
  skipPreflight: true,
};

let txHash = await program.methods
  .initialize()
  .accounts({
    tokenAccountOwnerPda: tokenAccountOwnerPda,
    vaultTokenAccount: tokenVault,
    senderTokenAccount: tokenAccount.address,
    mintOfTokenBeingSent: createdSFT.mintAddress,
    signer: program.provider.publicKey,
  })
  .rpc(confirmOptions);

console.log(`Initialize`);
await logTransaction(txHash);

console.log(`Vault initialized.`);
tokenAccountInfo = await getAccount(program.provider.connection, tokenAccount.address);
console.log(
  "Owned token amount: " + tokenAccountInfo.amount / BigInt(mintDecimals)
);
tokenAccountInfo = await getAccount(program.provider.connection, tokenVault);
console.log(
  "Vault token amount: " + tokenAccountInfo.amount / BigInt(mintDecimals)
);

async function logTransaction(txHash) {
  const { blockhash, lastValidBlockHeight } =
    await program.provider.connection.getLatestBlockhash();

  await program.provider.connection.confirmTransaction({
    blockhash,
    lastValidBlockHeight,
    signature: txHash,
  });

  console.log(
    `Solana Explorer: https://explorer.solana.com/tx/${txHash}?cluster=devnet`
  );
}

txHash = await program.methods
  .transferIn(new anchor.BN(1 * mintDecimals))
  .accounts({
    tokenAccountOwnerPda: tokenAccountOwnerPda,
    vaultTokenAccount: tokenVault,
    senderTokenAccount: tokenAccount.address,
    mintOfTokenBeingSent: createdSFT.mintAddress,
    signer: program.provider.publicKey,
  })
  .signers([program.provider.wallet.payer])
  .rpc(confirmOptions);

console.log(`Transfer one token into the vault.`);
await logTransaction(txHash);

tokenAccountInfo = await getAccount(program.provider.connection, tokenAccount.address);
console.log(
  "Owned token amount: " + tokenAccountInfo.amount / BigInt(mintDecimals)
);

tokenAccountInfo = await getAccount(program.provider.connection, tokenVault);
console.log(
  "Vault token amount: " + tokenAccountInfo.amount / BigInt(mintDecimals)
);

txHash = await program.methods
  .transferOut(new anchor.BN(1 * mintDecimals))
  .accounts({
    tokenAccountOwnerPda: tokenAccountOwnerPda,
    vaultTokenAccount: tokenVault,
    senderTokenAccount: tokenAccount.address,
    mintOfTokenBeingSent: createdSFT.mintAddress,
    signer: program.provider.publicKey,
  })
  .signers([program.provider.wallet.payer])
  .rpc(confirmOptions);

console.log(`Transfer one token out of the vault.`);
await logTransaction(txHash);

tokenAccountInfo = await getAccount(program.provider.connection, tokenAccount.address);
console.log(
  "Owned token amount: " + tokenAccountInfo.amount / BigInt(mintDecimals)
);

tokenAccountInfo = await getAccount(program.provider.connection, tokenVault);
console.log(
  "Vault token amount: " + tokenAccountInfo.amount / BigInt(mintDecimals)
);
*/
