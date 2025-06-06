export async function getArrLocal(key) {
  try {
    let arrItems = [];

    const response = localStorage.getItem(key);
    if (response !== null) {
      arrItems = await JSON.parse(response);
    }

    if (!Array.isArray(arrItems)) {
      localStorage.removeItem(key);
      return [];
    }

    for (const item of arrItems) {
      if (typeof item !== 'string') {
        localStorage.removeItem(key);
        return [];
      }
    }

    return arrItems;
  } catch {
    return [];
  }
}

export async function creatItemArrLocal(key, newItem) {
  try {
    const arrItems = await getArrLocal(key);

    if (typeof newItem === 'string' && !arrItems.includes(newItem)) {
      arrItems.push(newItem);
    }

    arrItems.sort((a, b) => {
      return Number(a) - Number(b);
    });

    const strArr = JSON.stringify(arrItems);
    localStorage.setItem(key, strArr);
    return true;
  } catch {
    return false;
  }
}
