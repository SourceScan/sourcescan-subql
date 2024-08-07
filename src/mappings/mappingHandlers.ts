import { NearAction } from '@subql/types-near'
import { NearActionEntity } from '../types/models'

export async function handleAction(action: NearAction): Promise<void> {
  // An Action can belong to either a transaction or a receipt
  // To check which one, we can check if action.transaction is null
  // If it is null, then it belongs to a receipt

  logger.info(
    `Handling action at ${
      action.transaction
        ? action.transaction.block_height
        : action.action.block_height
    }`
  )

  const id = action.transaction
    ? `${action.transaction.block_height}-${action.transaction.result.id}-${action.id}`
    : `${action.action.block_height}-${action.action.id}-${action.id}`
  const sender = action.transaction
    ? action.transaction.signer_id
    : action.action.predecessor_id
  const receiver = action.transaction
    ? action.transaction.receiver_id
    : action.action.receiver_id

  const actionRecord = NearActionEntity.create({
    id: id,
    sender: sender,
    receiver: receiver,
    txHash: action.transaction
      ? action.transaction.result.id
      : action.action.id,
    blockNumber: action.transaction
      ? action.transaction.block_height
      : action.action.block_height,
  })

  await actionRecord.save()
}
