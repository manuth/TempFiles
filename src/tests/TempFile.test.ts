import Assert = require("assert");
import { createFile, pathExists, remove, stat, writeFile } from "fs-extra";
import { TempFile } from "..";

/**
 * Registers tests for the `TempFile` class.
 */
export function TempFileTests(): void
{
    suite(
        "TempFile",
        () =>
        {
            let tempFile: TempFile;
            let text: string;

            suiteSetup(
                () =>
                {
                    text = "Hello World";
                });

            setup(
                () =>
                {
                    tempFile = new TempFile();
                });

            teardown(
                () =>
                {
                    try
                    {
                        tempFile.Dispose();
                    }
                    catch { }
                });

            test(
                "Checking whether files are created correctly…",
                async () => Assert.ok(await pathExists(tempFile.FullName)));

            test(
                "Checking whether the temporary file can be written…",
                async () => writeFile(tempFile.FullName, text));

            test(
                "Checking whether the `TempFile`-object can be disposed…",
                () => Assert.doesNotThrow(() => tempFile.Dispose()));

            test(
                "Checking whether the temporary file is deleted by invoking `Dispose`…",
                async () =>
                {
                    tempFile.Dispose();
                    Assert.ok(!await pathExists(tempFile.FullName));
                });

            test(
                "Checking whether the file-name is available right after disposing it…",
                async () =>
                {
                    tempFile.Dispose();
                    await Assert.doesNotReject(() => createFile(tempFile.FullName));
                    return remove(tempFile.FullName);
                });

            if (process.platform === "linux")
            {
                test(
                    "Checking whether the `mode` is applied correctly…",
                    async () =>
                    {
                        let mode = 0o007;

                        let file = new TempFile(
                            {
                                Mode: mode
                            });

                        Assert.strictEqual((await stat(file.FullName)).mode & 0o777, mode);
                        file.Dispose();
                    });
            }
        });
}
