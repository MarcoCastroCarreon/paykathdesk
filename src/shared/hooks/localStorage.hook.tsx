type getItemFn = (key: string, parse?: boolean) => string | any;

type setItemFn = (key: string, value: any, stringify?: boolean) => void;

type LocalStorage = { getItem: getItemFn; setItem: setItemFn };

const useLocalStorage = (): LocalStorage => {
  function getItem(key: string, parse: boolean = false): string | any {
    const value = localStorage.getItem(key);
    if (!value) return value;
    if (parse) {
      return JSON.parse(value);
    }

    return value;
  }

  function setItem(key: string, value: any, stringify: boolean = false): void {
    if (stringify) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }

  return { getItem, setItem };
};

export default useLocalStorage;
