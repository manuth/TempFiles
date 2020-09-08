import { writeFileSync } from "fs-extra";
import { TempDirectory } from "../TempDirectory";
import { TempFile } from "../TempFile";
import { ITestFiles } from "./ITestFiles";

let keep = process.argv.slice(1).some((argument) => argument === "keep");
let tempDir = new TempDirectory({ Keep: keep });
writeFileSync(tempDir.MakePath("Test"), "hello world");

process.send(
    {
        file: new TempFile({ Keep: keep }).FullName,
        dir: tempDir.FullName
    } as ITestFiles);
