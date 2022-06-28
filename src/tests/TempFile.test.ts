import { doesNotReject, doesNotThrow, ok, strictEqual } from "node:assert";
import fs from "fs-extra";
import { ITempFileSystemOptions } from "../ITempFileSystemOptions.js";
import { TempFile } from "../TempFile.js";

const { createFile, pathExists, remove, stat, writeFile } = fs;

/**
 * Registers tests for the {@link TempFile `TempFile`} class.
 */
export function TempFileTests(): void
{
    suite(
        nameof(TempFile),
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
                async () => ok(await pathExists(tempFile.FullName)));

            test(
                "Checking whether the temporary file can be written…",
                async () => writeFile(tempFile.FullName, text));

            test(
                `Checking whether the \`${nameof(TempFile)}\`-object can be disposed…`,
                () => doesNotThrow(() => tempFile.Dispose()));

            test(
                `Checking whether the temporary file is deleted by invoking \`${nameof<TempFile>((f) => f.Dispose)}\`…`,
                async () =>
                {
                    tempFile.Dispose();
                    ok(!await pathExists(tempFile.FullName));
                });

            test(
                "Checking whether the file-system entry name is available right after the disposal…",
                async () =>
                {
                    tempFile.Dispose();
                    await doesNotReject(() => createFile(tempFile.FullName));
                    return remove(tempFile.FullName);
                });

            if (process.platform === "linux")
            {
                test(
                    `Checking whether the \`${nameof<ITempFileSystemOptions>((o) => o.Mode)}\` is applied correctly…`,
                    async () =>
                    {
                        let mode = 0o007;

                        let file = new TempFile(
                            {
                                Mode: mode
                            });

                        strictEqual((await stat(file.FullName)).mode & 0o777, mode);
                        file.Dispose();
                    });
            }
        });
}
