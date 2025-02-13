import Decimal from "decimal.js";

const changeInput = (input: number) => (new Decimal(input).isNaN() ? 0 : input);

export const decimalExtended = {
  plus: (input1: number, input2: number) => {
    input1 = changeInput(input1 || 0);
    input2 = changeInput(input2 || 0);

    let result = new Decimal(input1).plus(input2).toFixed();

    const res_decimalPlaces = new Decimal(result).decimalPlaces();

    if (new Decimal(res_decimalPlaces).greaterThan(8)) {
      result = new Decimal(result).toFixed(8, Decimal.ROUND_DOWN);
    }

    return result;
  },

  minus: (input1: number, input2: number) => {
    input1 = changeInput(input1 || 0);
    input2 = changeInput(input2 || 0);

    let result = new Decimal(input1).minus(input2).toFixed();

    const res_decimalPlaces = new Decimal(result).decimalPlaces();

    if (new Decimal(res_decimalPlaces).greaterThan(8)) {
      result = new Decimal(result).toFixed(8, Decimal.ROUND_DOWN);
    }

    return result;
  },

  mul: (input1: number, input2: number) => {
    input1 = changeInput(input1 || 0);
    input2 = changeInput(input2 || 0);

    let result = new Decimal(input1).mul(input2).toFixed();

    const res_decimalPlaces = new Decimal(result).decimalPlaces();

    if (new Decimal(res_decimalPlaces).greaterThan(8)) {
      result = new Decimal(result).toFixed(8, Decimal.ROUND_DOWN);
    }

    return result;
  },

  div: (input1: number, input2: number) => {
    input1 = changeInput(input1 || 0);
    input2 = changeInput(input2 || 0);

    let result = new Decimal(input1).div(input2).toFixed();

    const res_decimalPlaces = new Decimal(result).decimalPlaces();

    if (new Decimal(res_decimalPlaces).greaterThan(8)) {
      result = new Decimal(result).toFixed(8, Decimal.ROUND_DOWN);
    }

    return result;
  },

  abs: (input1: number) => {
    input1 = changeInput(input1 || 0);

    let result = new Decimal(input1).absoluteValue().toFixed();

    const res_decimalPlaces = new Decimal(result).decimalPlaces();

    if (new Decimal(res_decimalPlaces).greaterThan(8)) {
      result = new Decimal(result).toFixed(8, Decimal.ROUND_DOWN);
    }

    return result;
  },

  /**
   *
   * @param {*} input1 number
   * @param {*} input2 allow decimal (gte 0) / digit (lt 0)
   * @returns
   */
  roundDownNumber: (input1: number, input2: number) => {
    input1 = changeInput(input1 || 0);
    input2 = changeInput(input2 || 0);

    if (new Decimal(input2).lessThan(0)) {
      const input2_absValue = new Decimal(input2).absoluteValue();

      const digit = new Decimal(10).toPower(input2_absValue);

      return new Decimal(
        new Decimal(new Decimal(input1).toFixed(0, Decimal.ROUND_DOWN))
          .dividedBy(digit)
          .toFixed(0, Decimal.ROUND_DOWN)
      ).mul(digit);
    } else {
      // return new Decimal(input1).toFixed(input2, Decimal.ROUND_DOWN);

      const decimalsPow = new Decimal(10).toPower(input2);

      return new Decimal(
        new Decimal(new Decimal(input1).mul(decimalsPow)).floor()
      ).dividedBy(decimalsPow);
    }
  },

  /**
   *
   * @param {*} input1 number
   * @param {*} input2 number
   * @param {string} input3 string of operator
   * @returns
   */
  OP: (
    input1: number,
    input2: number,
    input3: ">" | ">=" | "<" | "<=" | "=" | "!="
  ) => {
    input1 = changeInput(input1 || 0);
    input2 = changeInput(input2 || 0);

    let result = false;

    switch (input3) {
      case ">":
        result = new Decimal(input1).greaterThan(input2);

        break;

      case ">=":
        result = new Decimal(input1).greaterThanOrEqualTo(input2);

        break;

      case "<":
        result = new Decimal(input1).lessThan(input2);

        break;

      case "<=":
        result = new Decimal(input1).lessThanOrEqualTo(input2);

        break;

      case "=":
        result = new Decimal(input1).equals(input2);

        break;

      case "!=":
        result = new Decimal(input1).equals(input2);
        result = !result;

        break;

      default:
        break;
    }

    return result;
  },

  getAllowDecimal: (input1: number) => {
    input1 = changeInput(input1 || 0);

    let result: number | Decimal = 0;

    const input1_precision = new Decimal(input1).precision(true);

    switch (true) {
      case new Decimal(input1_precision).greaterThan(1):
        result = new Decimal(new Decimal(input1_precision).minus(1)).negated();
        break;

      default:
        result = new Decimal(input1).decimalPlaces();
        break;
    }

    return result;
  },

  // FOR result type INTEGER
  roundNumber: (input1: number) => {
    input1 = changeInput(input1 || 0);

    let result: number | string | Decimal = new Decimal(input1).round();
    result = new Decimal(result).toFixed();

    const res_decimalPlaces = new Decimal(result).decimalPlaces();

    if (new Decimal(res_decimalPlaces).greaterThan(8)) {
      // result = new Decimal(result).toFixed(8, Decimal.ROUND_DOWN);
      result = new Decimal(result).toFixed(8);
    }

    return result;
  },

  // FOR result type FLOAT
  roundNumber_decimal: (input1: number, input2: number) => {
    input1 = changeInput(input1 || 0);
    input2 = changeInput(input2 || 0);

    let result = new Decimal(input1).toFixed(input2);

    const res_decimalPlaces = new Decimal(result).decimalPlaces();

    if (new Decimal(res_decimalPlaces).greaterThan(8)) {
      // result = new Decimal(result).toFixed(8, Decimal.ROUND_DOWN);
      result = new Decimal(result).toFixed(8);
    }

    return result;
  },
};
