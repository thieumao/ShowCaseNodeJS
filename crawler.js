const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const URL = "http://ncs.niteco.se/bemz/";

request(URL, function (err, res, body) {
  if (err) {
    console.log(err);
  } else {
    const arr = [];
    let dataList = [];
    let $ = cheerio.load(body);
    $("#content1").each(function (index) {
      console.log("index = ", index);
      const title = $(this).find("h1").text();
      arr.push(title);

      if (index == 0) {
        const content1 = $(this).find("#content1 > p").text();
        const arr = content1.split("\n");
        let list = [];
        for (i in arr) {
          if (arr[i].trim().length > 0) {
            list.push(arr[i].trim());
          }
        }
        console.log(content1);
        const obj = {
          title: title,
          list: list,
        };
        dataList.push(JSON.stringify(obj));
      } else if (index == 1) {
        const content2 = $(this).find("#content1 > div > p").text();
        console.log(content2);
        const obj = {
          title: title,
          content: content2,
        };
        dataList.push(JSON.stringify(obj));
      } else if (index == 2) {
        const list = $(this).find("p.case-study-content-p");
        let technicalList = [];
        list.each(function (i) {
          console.log(i + " === " + $(this).text());
          technicalList.push($(this).text().trim());
        });
        const obj = {
          title: title,
          list: technicalList,
        };
        dataList.push(JSON.stringify(obj));
      }
    });
    const data = {
      title: arr,
    };
    // JSON.stringify(data)
    fs.writeFile("data/data.txt", `[${dataList.toString()}]`, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("success");
      }
    });
  }
});
