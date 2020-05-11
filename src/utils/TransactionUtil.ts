import { UserDocument } from '../models/User';
import { UserTransaction } from '../models/UserTransaction';

class TransactionUtil {
  static async addTransaction(user:UserDocument, title:string, amount:number):Promise<UserTransaction> {
    user.balance = user.balance + amount

    const transaction:UserTransaction = {
      title,
      amount,
      balance: user.balance
    } as UserTransaction

    user.transactions.push(transaction)
    await user.save()

    return transaction
  }
}

export default TransactionUtil
