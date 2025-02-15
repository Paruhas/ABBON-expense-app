export class CustomError extends Error {
  resData: any[] | Record<string, any>;

  constructor(message: string, resData: any[] | Record<string, any>) {
    super(message); // resCode
    this.resData = resData;
  }
}
