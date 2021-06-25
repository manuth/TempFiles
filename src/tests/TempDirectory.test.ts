import { doesNotReject, doesNotThrow, ok, strictEqual } from "assert";
import { join, resolve } from "path";
import { mkdir, pathExists, readFile, remove, stat, writeFile } from "fs-extra";
import { TempDirectory } from "../TempDirectory";

/**
 * Registers tests for the {@link TempDirectory `TempDirectory`} class.
 */
export function TempDirectoryTests(): void
{
    suite(
        "TempDirectory",
        () =>
        {
            let tempDir: TempDirectory;
            let tempFileName: string;
            let text: string;

            suiteSetup(
                () =>
                {
                    tempFileName = "test.txt";
                    text = "Hello World";
                });

            setup(
                () =>
                {
                    tempDir = new TempDirectory();
                });

            teardown(
                () =>
                {
                    try
                    {
                        tempDir.Dispose();
                    }
                    catch { }
                });

            suite(
                "General",
                () =>
                {
                    test(
                        "Checking whether directories are created correctly…",
                        async () => ok(await pathExists(tempDir.FullName)));

                    test(
                        "Checking whether files can be written inside the temporary directory…",
                        async () => doesNotReject(async () => writeFile(tempDir.MakePath(tempFileName), text)));

                    test(
                        "Checking whether files written inside the temporary directory exists…",
                        async () =>
                        {
                            await writeFile(tempDir.MakePath(tempFileName), text);
                            strictEqual((await readFile(tempDir.MakePath(tempFileName))).toString(), text);
                        });

                    test(
                        "Checking whether temporary directories can be disposed…",
                        () => doesNotThrow(() => tempDir.Dispose()));

                    test(
                        "Checking whether temporary directories are deleted by invoking `Dispose`…",
                        async () =>
                        {
                            tempDir.Dispose();
                            ok(!await pathExists(tempDir.FullName));
                        });

                    test(
                        "Checking whether temporary directories can be deleted even if they contain files…",
                        async () =>
                        {
                            ok(await pathExists(tempDir.FullName));
                            await writeFile(tempDir.MakePath(tempFileName), text);
                            ok(await pathExists(tempDir.MakePath(tempFileName)));
                            tempDir.Dispose();
                            ok(!await pathExists(tempDir.MakePath(tempFileName)));
                            ok(!await pathExists(tempDir.FullName));
                        });

                    test(
                        "Checking whether the file-system entry name is available right after the disposal…",
                        async () =>
                        {
                            tempDir.Dispose();
                            await doesNotReject(() => mkdir(tempDir.FullName));
                            return remove(tempDir.FullName);
                        });

                    if (process.platform === "linux")
                    {
                        test(
                            "Checking whether the `mode` is applied correctly…",
                            async () =>
                            {
                                let mode = 0o007;

                                let dir = new TempDirectory(
                                    {
                                        Mode: mode
                                    });

                                strictEqual((await stat(dir.FullName)).mode & 0o777, mode);
                                dir.Dispose();
                            });
                    }
                });

            suite(
                "MakePath(...string[])",
                () =>
                {
                    let path: string[];
                    let tempDir: TempDirectory;

                    suiteSetup(
                        () =>
                        {
                            tempDir = new TempDirectory();
                            path = ["foo", "bar", "baz", "this", "is", "a", "test.txt"];
                        });

                    suiteTeardown(
                        () =>
                        {
                            tempDir.Dispose();
                        });

                    test(
                        "Checking whether paths are built correctly…",
                        () => strictEqual(resolve(join(tempDir.FullName, ...path)), resolve(tempDir.MakePath(...path))));
                });
        });
}
