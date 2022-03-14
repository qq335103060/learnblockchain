import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  w32nft,
  Approval,
  ApprovalForAll,
  Transfer,
} from "../generated/w32nft/w32nft";
import { TransferEntity } from "../generated/schema";

export function handleTransfer(event: Transfer): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  // let entity = TransferEntity.load(
  //   event.block.hash.toHex() + "-" + event.logIndex.toString()
  //   // event.transaction.from.toHex() + "-" + event.logIndex.toString()+"-"+event.params.tokenId.toHex()
  // );
  let entity = TransferEntity.load(event.params.tokenId.toString());

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new TransferEntity(event.params.tokenId.toString());
  }

  // Entity fields can be set based on event parameters
  entity.from = event.params.from;
  ``;
  entity.to = event.params.to;

  entity.tokenId = event.params.tokenId;

  //转账路径
  let addr: Array<Bytes> = entity.path;
  addr.push(event.params.from);
  entity.path = addr;

  //hahs路径
  let hash: Array<Bytes> = entity.hashPath;
  hash.push(event.transaction.hash);
  entity.hashPath = hash;

  // Entities can be written to the store with `.save()`
  entity.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.addNft(...)
  // - contract.balanceOf(...)
  // - contract.getApproved(...)
  // - contract.isApprovedForAll(...)
  // - contract.name(...)
  // - contract.ownerOf(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenURI(...)
}

// export function handleApproval(event: Approval): void {
//   let entity = TransferEntity.loadTo(event.params.owner);
// }

// export function handleApprovalForAll(event: ApprovalForAll): void {}

// export function handleTransfer(event: Transfer): void {}
