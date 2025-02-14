export const consoleLog = (msg: string, data: any) => {
  process.env.SHOW_LOGGING === "true" && console.log(msg, data);
};
