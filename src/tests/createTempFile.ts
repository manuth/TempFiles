import fs from "fs-extra";
import { TempDirectory } from "../TempDirectory.js";
import { TempFile } from "../TempFile.js";
import { ITestFiles } from "./ITestFiles.js";

const { writeFileSync } = fs;

let keep = process.argv.slice(1).some((argument) => argument === "keep");
let tempDir = new TempDirectory({ Keep: keep });
writeFileSync(tempDir.MakePath("Test"), "hello world");

process.send(
    {
        file: new TempFile({ Keep: keep }).FullName,
        dir: tempDir.FullName
    } as ITestFiles);
