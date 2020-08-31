import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance;

  constructor() {
    this.transactions = [];
    this.balance = { income: 0, outcome: 0, total: 0 };
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.filter(transaction => {
      return transaction.type === 'income';
    });

    const outcome = this.transactions.filter(transaction => {
      return transaction.type === 'outcome';
    });

    const totalIncome: number = income.reduce((total, { value }) => {
      return total + Number(value || 0);
    }, 0);

    const totalOutcome = outcome.reduce((total, { value }) => {
      return total + Number(value || 0);
    }, 0);

    const total = totalIncome - totalOutcome;

    return { income: totalIncome, outcome: totalOutcome, total };
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    if (type === 'outcome') {
      const balance = this.getBalance();

      if (balance.total < value) throw new Error('Invalid value');
    }
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
