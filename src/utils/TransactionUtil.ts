import { UserDocument } from '../models/User';
import { UserTransaction } from '../models/UserTransaction';

class TransactionUtil {
  static async addTransaction(
    user: UserDocument,
    title: string,
    amount: number,
    reference: string
  ): Promise<UserTransaction> {
    user.balance += amount;

    if (user.transactions.map((t) => t.reference).indexOf(reference) !== -1) {
      // @todo fix
      console.info('Skipping duplicate transaction');
      return null;
    }

    const transaction: UserTransaction = {
      title,
      amount,
      balance: user.balance,
      reference,
    } as UserTransaction;

    user.transactions.push(transaction);
    await user.save();

    return transaction;
  }
}

export default TransactionUtil;
