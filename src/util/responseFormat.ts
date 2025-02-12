import dayjs from "../lib/dayjsExtended";

interface responseObjectType {
  res_code: string;
  res_type: string;
  res_message: string;
  res_data: object;
  res_time: string;
}

function responseFormat(
  code: string,
  type: string = "error",
  message: string,
  data: any = {}
) {
  try {
    let responseObject: responseObjectType;

    switch (type) {
      case "success":
        responseObject = response_success(code, message, data);
        break;

      case "error":
        responseObject = response_error(code, message, data);
        break;

      default:
        responseObject = response_error("9999", "ERROR.", {});
        break;
    }

    return responseObject;
  } catch (error) {}
}

function response_success(
  code: string,
  message: string,
  data: any
): responseObjectType {
  return {
    res_code: code || "0000",
    res_type: "success",
    res_message: message,
    res_data: data,
    res_time: dayjs().utc().format(),
  };
}

function response_error(code: string, message: string = "ERROR.", data: any) {
  return {
    res_code: code || "9999",
    res_type: "error",
    res_message: message,
    res_data: data,
    res_time: dayjs().utc().format(),
  };
}

export default responseFormat;
