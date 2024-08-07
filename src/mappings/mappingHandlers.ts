import { NearAction } from '@subql/types-near'
import { NearActionEntity } from '../types/models'

export async function handleAction(nearAction: NearAction): Promise<void> {
  const isTransaction = !!nearAction.transaction
  const blockHeight = !isTransaction
    ? nearAction.action.block_height
    : nearAction.transaction.block_height
  const id = !isTransaction
    ? `${nearAction.action.block_height}-${nearAction.action.id}-${nearAction.id}`
    : `${nearAction.transaction.block_height}-${nearAction.transaction.result.id}-${nearAction.id}`
  const sender = !isTransaction
    ? nearAction.action.predecessor_id
    : nearAction.transaction.signer_id
  const receiver = !isTransaction
    ? nearAction.action.receiver_id
    : nearAction.transaction.receiver_id
  const txHash = !isTransaction
    ? nearAction.action.id
    : nearAction.transaction.result.id

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
