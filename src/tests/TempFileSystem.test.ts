import Assert = require("assert");
import { ChildProcess, fork } from "child_process";
import { tmpdir } from "os";
import { isAbsolute, relative } from "path";
import { pathExists, remove } from "fs-extra";
import RandExp = require("randexp");
import { ITempNameOptions } from "../ITempNameOptions";
import { TempFile } from "../TempFile";
import { TempFileSystem } from "../TempFileSystem";
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
            suite(
                "General",
                () =>
                {
                    let files: ITestFiles;

                    /**
                     * Spawns the test-script.
                     *
                     * @param keep
                     * A value indicating whether the generated test-files should be kept.
                     */
                    async function SpawnTestScript(keep: boolean): Promise<void>
                    {
                        let child: ChildProcess;
                        child = fork(require.resolve("./createTempFile"), keep ? ["keep"] : []);
                        child.on("message", (message: ITestFiles) => files = message);

                        return new Promise(
                            (resolve) =>
                            {
                                child.on("exit", () => resolve());
                            });
                    }

                    suiteSetup(
                        async function()
                        {
                            return SpawnTestScript(false);
                        });

                    test(
                        "Checking whether temporary file-entries are deleted automatically on `process.exit`…",
                        async () =>
                        {
                            Assert.ok(!await pathExists(files.file));
                        });

                    test(
                        "Checking whether directories with contents are deleted automatically on `process.exit` as well…",
                        async () =>
                        {
                            Assert.ok(!await pathExists(files.dir));
                        });

                    test(
                        "Checking whether temporary files can be kept even after `process.exit` occurs…",
                        async function()
                        {
                            this.timeout(5 * 1000);
                            this.slow(3 * 1000);

                            await SpawnTestScript(true);
                            Assert.ok(await pathExists(files.file));
                            Assert.ok(await pathExists(files.dir));
                            await remove(files.file);
                            await remove(files.dir);
                        });
                });

            suite(
                "Disposed",
                () =>
                {
                    let tempFile: TempFile;

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
                            catch
                            { }
                        });

                    test(
                        "Checking whether `Disposed` initially equals `false`…",
                        () =>
                        {
                            Assert.strictEqual(tempFile.Disposed, false);
                        });

                    test(
                        "Checking whether `Disposed` equals `true` once it has been disposed…",
                        () =>
                        {
                            tempFile.Dispose();
                            Assert.strictEqual(tempFile.Disposed, true);
                        });
                });

            test(
                "Dispose",
                () =>
                {
                    test(
                        "Checking whether disposing a temp file-system entry twice throws an exception…",
                        () =>
                        {
                            let file = new TempFile();
                            file.Dispose();
                            Assert.throws(() => file.Dispose());
                        });
                });

            suite(
                "TempBaseName",
                () =>
                {
                    test(
                        "Checking whether a pattern for creationg a base-name can be provided…",
                        () =>
                        {
                            let pattern = /^\d{2,30}test\w*[0-5]{3}$/;

                            Assert.ok(
                                pattern.test(
                                    TempFileSystem.TempBaseName(
                                        {
                                            FileNamePattern: pattern,
                                            Prefix: "",
                                            Suffix: ""
                                        })));
                        });

                    test(
                        "Checking whether a prefix and a suffix can be specified…",
                        () =>
                        {
                            let generator = new RandExp(/\w{10}/);
                            let prefix = generator.gen();
                            let suffix = generator.gen();
                            let pattern = /\d{3}/;

                            let tempName = TempFileSystem.TempBaseName(
                                {
                                    FileNamePattern: pattern,
                                    Prefix: prefix,
                                    Suffix: suffix
                                });

                            Assert.ok(tempName.startsWith(prefix));
                            Assert.ok(tempName.endsWith(suffix));
                            Assert.ok(pattern.test(tempName));
                        });

                    test(
                        "Checking whether the temp base-name is not absolute…",
                        () =>
                        {
                            Assert.ok(!isAbsolute(TempFileSystem.TempBaseName()));
                        });
                });

            suite(
                "TempName",
                () =>
                {
                    test(
                        "Checking whether file-names generated using `TempName` are relative to the system's temp-dir by default…",
                        () =>
                        {
                            let relativePath = relative(tmpdir(), TempFileSystem.TempName());
                            Assert.ok(!isAbsolute(relativePath));
                            Assert.ok(!relativePath.startsWith(".."));
                        });

                    test(
                        "Checking whether an inexistent file-name is chosen automatically…",
                        async function()
                        {
                            this.timeout(0);
                            let pattern = /[1-2]/;

                            let options: ITempNameOptions = {
                                FileNamePattern: pattern,
                                Prefix: "",
                                Suffix: "",
                                Retries: Infinity
                            };

                            let file = new TempFile(options);
                            let tempName = TempFileSystem.TempName(options);
                            Assert.ok(!await pathExists(tempName));
                            file.Dispose();
                        });

                    test(
                        "Checking whether an error is thrown if no free file-name could be found…",
                        () =>
                        {
                            let pattern = /test/;

                            let options: ITempNameOptions = {
                                FileNamePattern: pattern,
                                Prefix: "",
                                Suffix: ""
                            };

                            let file = new TempFile(options);
                            Assert.throws(() => TempFileSystem.TempName(options));
                            file.Dispose();
                        });

                    test(
                        "Checking whether paths generated using `TempName` are absolute…",
                        () =>
                        {
                            Assert.ok(isAbsolute(TempFileSystem.TempName()));
                        });
                });
        });
}
