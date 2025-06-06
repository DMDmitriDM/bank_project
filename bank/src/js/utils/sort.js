import { getNumDate } from './utils.js';

function getNumberDate(transactions) {
  if (transactions.length !== 0) {
    const dateObj = new Date(Date.parse(transactions[0].date));
    return Number(getNumDate(dateObj));
  } else {
    return 0;
  }
}

export function sortAccounts(arrOld, sort) {
  switch (sort) {
    case 0:
      return arrOld.sort((a, b) => {
        return Number(a.account) - Number(b.account);
      });
    case 1:
      return arrOld.sort((a, b) => {
        return (
          Number(a.balance.toFixed(2)) * 100 -
          Number(b.balance.toFixed(2)) * 100
        );
        // return Number((a.balance - b.balance).toFixed(2)) * 100;
      });
    case 2:
      return arrOld.sort((a, b) => {
        return getNumberDate(a.transactions) - getNumberDate(b.transactions);
      });
  }
}
