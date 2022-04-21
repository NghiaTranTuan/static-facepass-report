"use strict";

const fs = require("fs");
const csvtojsonV2 = require("csvtojson/v2");
const { formatTimeStamp } = require("./helper");
const { login, getUserInfo } = require("./reqestServer");
const { exit } = require("process");

// const dateString = process.argv[2]
// if (!dateString) {
//     console.log("Please enter date string YYYY-MM-DD")
//     exit()
// }

async function reportByDate({ date }) {
  let csvFilePath = `./demo-static/op2/face-engine-counter-2022-04-${date}.log-op1.csv`;

  const arrayGroupSub = [];

  let jsonArray = await csvtojsonV2().fromFile(csvFilePath);

  jsonArray = jsonArray.sort((a, b) => a.timestamp < b.timestamp);

  let groupByTagCheckIn = new Object();

  const groupSub = {};

  let groupByTagPermaRegister = new Object();

  let currenSubCode = null;

  for (const dataRow of jsonArray) {
    const tag = dataRow["tag"];
    if (!tag) {
      continue;
    }
    let tagStrings = tag.split("-");
    if (tagStrings.length === 1) {
      continue;
    }
    let type = tagStrings[4];
    let actionTimestamp = tagStrings[5];
    let timestamp = tagStrings[3];

    const subCode = dataRow["topId"];
    let key = `${type}+${actionTimestamp}`;

    if (key.includes("faceAuthV4")) {
      if (!groupSub.hasOwnProperty(key)) {
        if (currenSubCode !== subCode) {
          currenSubCode = subCode;
          groupSub[key] = subCode;
          arrayGroupSub.push({
            date: formatTimeStamp(actionTimestamp),
            sub: subCode,
          });
        }
      }
    }

    if (key.includes("faceAuthV4")) {
      if (groupByTagCheckIn.hasOwnProperty(key)) {
        groupByTagCheckIn[key].push(dataRow);
      } else {
        groupByTagCheckIn[key] = [dataRow];
      }
    }
  }

  let totalFaceAuthCount = 0;
  let totalFaceAuthSuccess = 0;

  for (const tag in groupByTagCheckIn) {
    totalFaceAuthCount += 1;
    // console.log(`tag ${tag}`)
    let isFaceAuthSuccess = false;
    if (Object.hasOwnProperty.call(groupByTagCheckIn, tag)) {
      const elements = groupByTagCheckIn[tag];
      for (const element of elements) {
        // console.log(element)
        if (element["topId"] && element["topId"] !== "null") {
          isFaceAuthSuccess = true;
        } else {
        }
      }
    }
    if (isFaceAuthSuccess) {
      totalFaceAuthSuccess += 1;
    }
  }
  return arrayGroupSub;
}

function calcPercentage(total, num) {
  if (!num) {
    return 0;
  }
  const result = (num / total) * 100;
  return parseFloat(result.toFixed(2));
}

async function printReport({ date, token }) {
  const arr = await reportByDate({ date: date });
  let arraySub = [];
  if (arr) {
    arraySub = arr.map(async (item) => await getUser(item, token));
  }
  return await Promise.all(arraySub);
}

async function getUser(val, token) {
  if (val.sub) {
    const res = await getUserInfo({ sub: val.sub, token: token });
    if (res) {
      const calAge = 2022 - parseInt(res.customer.birthYear);
      return {
        ...val,
        age: calAge,
      };
    } else {
      return {
        ...val,
        age: null,
      };
    }
  }
}

async function reportSuccessRate({ date, token }) {
  const result = {
    child: 0,
    adult: 0,
    old: 0,
    undefined: 0,
  };
  const arr = await printReport({ date: date, token: token });
  let countSuccess = 0;
  if (arr.length > 0) {
    let countOld = 0;
    let countUndefined = 0;
    let countAdult = 0;
    let countChild = 0;

    arr.map((item) => {
      if (item.age) {
        countSuccess += 1;
      }

      if (item.age && item.age <= 12) {
        result["child"] = countChild += 1;
      }

      if (item.age && item.age > 12 && item.age <= 65) {
        result["adult"] = countAdult += 1;
      }

      if (item.age && item.age > 65) {
        result["old"] = countOld += 1;
      }

      if (!item.age) {
        result["undefined"] = countUndefined += 1;
      }
    });
    console.log(`================== 2022-04-${date} ===================`);
    console.log("[RESULT] : ", result);
    console.log("[TOTAL REQUEST] : ", arr.length);
    console.log(`[TOTAL SUCCESS] : ${countSuccess}%` );
    console.log(
      "[PERCENTAGE RATE] : ",
      calcPercentage(arr.length, countSuccess)
    );
    console.log(`======================================================\n`);
  }
}

async function main() {
  const token = await login();
  await reportSuccessRate({ date: "06", token: token });
  await reportSuccessRate({ date: "07", token: token });
  await reportSuccessRate({ date: "08", token: token });
  await reportSuccessRate({ date: "09", token: token });
  await reportSuccessRate({ date: "10", token: token });
  await reportSuccessRate({ date: "11", token: token });
  await reportSuccessRate({ date: "12", token: token });
  await reportSuccessRate({ date: "13", token: token });
  await reportSuccessRate({ date: "14", token: token });
  await reportSuccessRate({ date: "15", token: token });
  await reportSuccessRate({ date: "16", token: token });
  await reportSuccessRate({ date: "17", token: token });
}

main();
