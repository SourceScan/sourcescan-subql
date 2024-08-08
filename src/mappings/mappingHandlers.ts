import { NearAction } from '@subql/types-near'
import { NearActionEntity } from '../types/models'

export async function handleAction(nearAction: NearAction): Promise<void> {
  // if transaction - normal deploy, receipt - batch transaction
  const isTransaction = !!nearAction.transaction
  const isReceipt = !!nearAction.receipt

  if (!isTransaction && !isReceipt) {
    logger.warn(
      `Action does not have a transaction or receipt: ${JSON.stringify(
        nearAction
      )}`
    )
    return
  }

  const blockHeight = isTransaction
    ? nearAction.transaction.block_height
    : nearAction.receipt!.block_height

  const id = isTransaction
    ? `${nearAction.transaction.block_height}-${nearAction.transaction.result.id}-${nearAction.id}`
    : `${nearAction.receipt!.block_height}-${nearAction.receipt!.receipt_id}-${
        nearAction.id
      }`

  const sender = isTransaction
    ? nearAction.transaction.signer_id
    : nearAction.receipt!.predecessor_id

  const receiver = isTransaction
    ? nearAction.transaction.receiver_id
    : nearAction.receipt!.receiver_id

  const txHash = isTransaction
    ? nearAction.transaction.result.id
    : nearAction.receipt!.receipt_id

  logger.info(`Handling action at ${blockHeight}`)

  const actionRecord = NearActionEntity.create({
    id: id,
    sender: sender,
    receiver: receiver,
    txHash: txHash,
    blockNumber: BigInt(blockHeight),
  })

  await actionRecord.save()
}
