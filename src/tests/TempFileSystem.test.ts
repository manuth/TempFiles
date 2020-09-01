import Assert = require("assert");
import { fork, ChildProcess } from "child_process";
import { pathExists } from "fs-extra";

/**
 * Registers tests for the `TempFileSystem` class.
 */
export function TempFileSystemTests(): void
{
    suite(
        "TempFileSystem",
        () =>
        {
            test(
                "Checking whether temporary file-entries are deleted automatically on `process.exit`…",
                async () =>
                {
                    let child: ChildProcess;
                    let fileName: string;
                    child = fork(require.resolve("./createTempFile"));
                    child.on("message", (message: string) => fileName = message);

                    await new Promise(
                        (resolve) =>
                        {
                            child.on("exit", () => resolve());
                        });

                    Assert.ok(!await pathExists(fileName));
                });
        });
}
