import moment from "moment";

const momentMod = (date?:any, format?:any, strict?:any) => {
  if (!date || typeof date === "undefined") {
    return moment();
  } else {
    const stringifyDate = date.toString();
    if (!format || typeof format === "undefined") {
      return moment(stringifyDate);
    }

    if (typeof strict === "boolean") {
      return moment(stringifyDate, format, strict);
    } else {
      return moment(stringifyDate, format);
    }
  }
};

export { momentMod };
