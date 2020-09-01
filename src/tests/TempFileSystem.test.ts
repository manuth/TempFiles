import Assert = require("assert");
import { fork, ChildProcess } from "child_process";
import { pathExists } from "fs-extra";
import { ITestFiles } from "./ITestFiles";

/**
 * Registers tests for the `TempFileSystem` class.
 */
export function TempFileSystemTests(): void
{
    suite(
        "TempFileSystem",
        () =>
        {
            let files: ITestFiles;

            suiteSetup(
                async function()
                {
                    let child: ChildProcess;
                    child = fork(require.resolve("./createTempFile"));
                    child.on("message", (message: ITestFiles) => files = message);

                    await new Promise(
                        (resolve) =>
                        {
                            child.on("exit", () => resolve());
                        });
                });

            test(
                "Checking whether temporary file-entries are deleted automatically on `process.exit`…",
                async () =>
                {
                    Assert.ok(!await pathExists(files.file));
                });

            test(
                "Checking whether directories with contents are deleted automatically on `process.exit as well…",
                async () =>
                {
                    Assert.ok(!await pathExists(files.dir));
                });
        });
}
