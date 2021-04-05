import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions
  }

  public getBalance(): Balance {
    return this.transactions.reduce((sum, current) => {
      const currentIncome = (current.type === 'income') ? current.value : 0
      const currentOutcome = (current.type === 'outcome') ? current.value : 0

      return {
        income: sum.income + currentIncome,
        outcome: sum.outcome + currentOutcome,
        total: sum.total + currentIncome - currentOutcome
      }
    }, {
      income: 0,
      outcome: 0,
      total: 0
    })
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const transaction = new Transaction({ title, value, type })

    if (type === 'outcome' && value > this.getBalance().total) {
      throw Error('Outcome exceeds current total balance.')
    }

    this.transactions.push(transaction)

    return transaction
  }
}

export default TransactionsRepository;
