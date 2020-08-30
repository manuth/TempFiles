import Assert = require("assert");
import FileSystem = require("fs-extra");
import { TempFile } from "..";

suite(
    "TempFile",
    () =>
    {
        let tempFile: TempFile;
        let tempFileName: string;
        let text: string;

        suiteSetup(
            () =>
            {
                text = "Hello World";
            });

        test(
            "Checking whether a temporary file can be created…",
            () =>
            {
                tempFile = new TempFile();
                tempFileName = tempFile.FullName;
            });

        test(
            "Checking whether the temporary file exists…",
            async () => Assert.strictEqual(await FileSystem.pathExists(tempFileName), true));

        test(
            "Checking whether the temporary file can be written…",
            async () => FileSystem.writeFile(tempFileName, text));

        test(
            "Checking whether the `TempFile`-object can be disposed…",
            () => Assert.doesNotThrow(() => tempFile.Dispose()));

        test(
            "Checking whether the temporary file has been deleted…",
            async () => Assert.strictEqual(await FileSystem.pathExists(tempFileName), false));
    });
