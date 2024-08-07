import { NearAction } from '@subql/types-near'
import { NearActionEntity, NearBlockEntity } from '../types/models'

import { NearBlock } from '@subql/types-near'

export async function handleBlock(block: NearBlock): Promise<void> {
  logger.info(`Handling block ${block.header.height}`)

  const blockRecord = NearBlockEntity.create({
    id: block.header.height.toString(),
    hash: block.header.hash,
    author: block.author,
    timestamp: BigInt(block.header.timestamp),
  })

  await blockRecord.save()
}

export async function handleAction(action: NearAction): Promise<void> {
  // An Action can belong to either a transaction or a receipt
  // To check which one, we can check if action.transaction is null
  // If it is null, then it belongs to a receipt
  if (!action.receipt) {
    return
  }

  logger.info(
    `Handling action at ${
      action.transaction
        ? action.transaction.block_height
        : action.receipt.block_height
    }`
  )

  const id = action.transaction
    ? `${action.transaction.block_height}-${action.transaction.result.id}-${action.id}`
    : `${action.receipt.block_height}-${action.receipt.id}-${action.id}`
  const sender = action.transaction
    ? action.transaction.signer_id
    : action.receipt.predecessor_id
  const receiver = action.transaction
    ? action.transaction.receiver_id
    : action.receipt.receiver_id

  const actionRecord = NearActionEntity.create({
    id: id,
    sender: sender,
    receiver: receiver,
  })

  await actionRecord.save()
}
