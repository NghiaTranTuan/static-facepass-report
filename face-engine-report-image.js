'use strict';

const fs = require('fs');
const csvtojsonV2 = require("csvtojson/v2");
const { exit } = require('process');

// const dateString = process.argv[2]
// if (!dateString) {
//     console.log("Please enter date string YYYY-MM-DD")
//     exit()
// }

// let csvFilePath = `./${dateString}/summary-${dateString}.csv`
let csvFilePath = `face-engine-counter-2022-02-01.log-op1.csv`
csvtojsonV2()
    .fromFile(csvFilePath)
    .then((jsonArray) => {
        console.log(`Total request: ${jsonArray.length}`);
        jsonArray = jsonArray.sort((a, b) => a.timestamp < b.timestamp)

        let groupByTagCheckIn = new Object()
        let groupByTagPermaRegister = new Object()
        for (const dataRow of jsonArray) {
            const tag = dataRow['tag']
            if (!tag) {
                continue
            }
            let tagStrings = tag.split('#')
            if (tagStrings.length === 1) {
                continue
            }
            let type = tagStrings[1]
            let actionTimestamp = tagStrings[2]
            let timestamp = tagStrings[3]
            // console.dir(dataRow)
            let key = `${type}###${actionTimestamp}`
            if (key.includes('CHECK_IN')) {
                if (groupByTagCheckIn.hasOwnProperty(key)) {
                    groupByTagCheckIn[key].push(dataRow)
                } else {
                    groupByTagCheckIn[key] = [dataRow]
                }
            } else if (key.includes('PERMANENT_REGISTER')) {
                if (groupByTagPermaRegister.hasOwnProperty(key)) {
                    groupByTagPermaRegister[key].push(dataRow)
                } else {
                    groupByTagPermaRegister[key] = [dataRow]
                }
            }
        }

        let totalFaceAuthCount = 0
        let totalFaceAuthSuccess = 0
        for (const tag in groupByTagCheckIn) {
            totalFaceAuthCount += 1
            // console.log(`tag ${tag}`)
            let isFaceAuthSuccess = false
            if (Object.hasOwnProperty.call(groupByTagCheckIn, tag)) {
                const elements = groupByTagCheckIn[tag];
                for (const element of elements) {
                    // console.log(element)
                    if (element['topId'] && element['topId'] !== 'null') {
                        isFaceAuthSuccess = true
                    } else {
                    }
                }
            }
            if (isFaceAuthSuccess) {
                totalFaceAuthSuccess += 1
            }
        }
        let totalFaceCount = Object.keys(groupByTagCheckIn).length
        console.log(`======= CHECK-IN =======`)
        console.log(`Total face authentication count = ${totalFaceCount}`)
        console.log(`Total face authentication success = ${totalFaceAuthSuccess}`)
        console.log(`Total face authentication success percentage = ${calcPercentage(totalFaceCount, totalFaceAuthSuccess)}%`)

        totalFaceAuthCount = 0
        totalFaceAuthSuccess = 0
        for (const tag in groupByTagPermaRegister) {
            totalFaceAuthCount += 1
            // console.log(`tag ${tag}`)
            let isFaceAuthSuccess = false
            if (Object.hasOwnProperty.call(groupByTagPermaRegister, tag)) {
                const elements = groupByTagPermaRegister[tag];
                for (const element of elements) {
                    // console.log(element)
                    if (element['topId'] && element['topId'] !== 'null') {
                        isFaceAuthSuccess = true
                    } else {
                    }
                }
            }
            if (isFaceAuthSuccess) {
                totalFaceAuthSuccess += 1
            }
        }
        totalFaceCount = Object.keys(groupByTagPermaRegister).length
        console.log(`======= PERMA-REGISTER =======`)
        console.log(`Total face authentication count = ${totalFaceCount}`)
        console.log(`Total face authentication success = ${totalFaceAuthSuccess}`)
        console.log(`Total face authentication success percentage = ${calcPercentage(totalFaceCount, totalFaceAuthSuccess)}%`)
    })

function calcPercentage(total, num) {
    if (!num) {
        return 0
    }
    const result = (num / total) * 100;
    return parseFloat(result.toFixed(2));
}
