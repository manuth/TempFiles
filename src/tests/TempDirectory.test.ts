import Assert = require("assert");
import FileSystem = require("fs-extra");
import Path = require("path");
import { TempDirectory } from "..";

suite(
    "TempDirectory",
    () =>
    {
        let tempDir: TempDirectory;
        let tempDirName: string;
        let tempFileName: string;
        let text: string;

        suiteSetup(
            () =>
            {
                tempFileName = "test.txt";
                text = "Hello World";
            });

        suite(
            "General",
            () =>
            {
                test(
                    "Checking whether a temporary directory can be created…",
                    () =>
                    {
                        tempDir = new TempDirectory();
                        tempDirName = tempDir.FullName;
                    });

                test(
                    "Checking whether the temporary directory exists…",
                    async () => Assert.strictEqual(await FileSystem.pathExists(tempDirName), true));

                test(
                    "Checking whether files can be written inside the temporary directory…",
                    async () => Assert.doesNotReject(async () => FileSystem.writeFile(tempDir.MakePath(tempFileName), text)));

                test(
                    "Checking whether the file written inside the temporary directory exists…",
                    async () => Assert.strictEqual((await FileSystem.readFile(tempDir.MakePath(tempFileName))).toString(), text));

                test(
                    "Checking whether the temporary directory can be disposed…",
                    () => Assert.doesNotThrow(() => tempDir.Dispose()));

                test(
                    "Checking whether the temporary directory has been deleted…",
                    async () => Assert.strictEqual(await FileSystem.pathExists(tempDirName), false));
            });

        suite(
            "MakePath(...string[])",
            () =>
            {
                let path: string[];

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
                    () => Assert.strictEqual(Path.resolve(Path.join(tempDir.FullName, ...path)), Path.resolve(tempDir.MakePath(...path))));
            });
    });