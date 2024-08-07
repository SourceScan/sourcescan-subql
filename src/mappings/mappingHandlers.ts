import { NearAction } from '@subql/types-near'
import { NearActionEntity } from '../types/models'

export async function handleAction(action: NearAction): Promise<void> {
  const isTransaction = !!action.transaction
  const blockHeight = isTransaction
    ? action.transaction.block_height
    : action.action.block_height
  const id = isTransaction
    ? `${action.transaction.block_height}-${action.transaction.result.id}-${action.id}`
    : `${action.action.block_height}-${action.action.id}-${action.id}`
  const sender = isTransaction
    ? action.transaction.signer_id
    : action.action.predecessor_id
  const receiver = isTransaction
    ? action.transaction.receiver_id
    : action.action.receiver_id
  const txHash = isTransaction ? action.transaction.result.id : action.action.id

  logger.info(`Handling action at ${blockHeight}`)

  const actionRecord = NearActionEntity.create({
    id: id,
    sender: sender,
    receiver: receiver,
    txHash: txHash,
    blockNumber: blockHeight,
  })

  await actionRecord.save()
}
