import { writeFileSync } from "fs-extra";
import { TempDirectory } from "../TempDirectory";
import { TempFile } from "../TempFile";
import { ITestFiles } from "./ITestFiles";

let tempDir = new TempDirectory();
writeFileSync(tempDir.MakePath("Test"), "hello world");

process.send(
    {
        file: new TempFile().FullName,
        dir: tempDir.FullName
    } as ITestFiles);
