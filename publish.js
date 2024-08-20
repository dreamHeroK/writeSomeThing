const ghPages = require("gh-pages");
const path = require("path");
const fs = require("fs");

let OriginFilePath = path.resolve(__dirname, "docs/images");
let CopyFilePath = path.resolve(__dirname, "_book/images");

getFiles(OriginFilePath, CopyFilePath);
function getFiles(OriginFilePath, CopyFilePath) {
  //读取newFile文件夹下的文件
  fs.readdir(OriginFilePath, { withFileTypes: true }, (err, files) => {
    for (let file of files) {
      //判断是否是文件夹，不是则直接复制文件到newFile中
      if (!file.isDirectory()) {
        //获取旧文件夹中要复制的文件
        const OriginFile = path.resolve(OriginFilePath, file.name);
        //获取新文件夹中复制的地方
        const CopyFile = path.resolve(CopyFilePath, file.name);
        //将文件从旧文件夹复制到新文件夹中
        if (!fs.existsSync(CopyFilePath)) {
          fs.mkdir(CopyFilePath, (err) => {
            // console.log(err)
          });
        }
        fs.copyFileSync(OriginFile, CopyFile);
      } else {
        //如果是文件夹就递归变量把最新的文件夹路径传过去
        const CopyDirPath = path.resolve(CopyFilePath, file.name);
        const OriginDirPath = path.resolve(OriginFilePath, file.name);
        fs.mkdir(CopyDirPath, (err) => {});
        // OriginFilePath = OriginPath
        // CopyFilePath = DirPath
        getFiles(OriginDirPath, CopyDirPath);
      }
    }
  });
}

function readSummaryToReadMe() {
  let summary = fs.readFileSync(
    path.resolve(__dirname, "docs/summary.md"),
    "utf-8"
  );
  summary = summary.replace(
    /\((.*)\.md\)/g,
    "(https://dreamherok.github.io/writeSomeThing/$1.html)"
  );
  let readme = fs.readFileSync(path.resolve(__dirname, "README.md"), "utf-8");
  let readmeArr = readme.split("<!--List-->");
  let other = readmeArr.join("").split("<!--ListEnd-->")[1];
  let newReadme =
    readmeArr[0] + "<!--List-->\n" + summary + "\n<!--ListEnd-->" + other || "";

  fs.writeFileSync(path.resolve(__dirname, "README.md"), newReadme);
}
readSummaryToReadMe();

ghPages.publish("_book", function (err) {
  console.log(err, "errr");
});
