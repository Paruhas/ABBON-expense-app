export class CustomError extends Error {
  resData: any[] | Record<string, any>;
  httpCode?: number;

  constructor(
    message: string,
    resData: any[] | Record<string, any>,
    httpCode?: number
  ) {
    super(message); // resCode
    this.resData = resData;
    this.httpCode = httpCode;
  }
}
