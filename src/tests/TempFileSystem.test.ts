import { ok, strictEqual, throws } from "assert";
import { ChildProcess, fork } from "child_process";
import { createRequire } from "module";
import { tmpdir } from "os";
import { isAbsolute, relative } from "path";
import fs from "fs-extra";
import RandExp from "randexp";
import { ITempFileSystemOptions } from "../ITempFileSystemOptions.js";
import { ITempNameOptions } from "../ITempNameOptions.js";
import { TempFile } from "../TempFile.js";
import { TempFileSystem } from "../TempFileSystem.js";
import { ITestFiles } from "./ITestFiles.js";
import { TestTempFile } from "./TestTempFileSystem.js";

const { pathExists, remove } = fs;

/**
 * Registers tests for the {@link TempFileSystem `TempFileSystem<T>`} class.
 */
export function TempFileSystemTests(): void
{
    suite(
        nameof(TempFileSystem),
        () =>
        {
            suite(
                nameof<TestTempFile>((file) => file.Register),
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
                        child = fork(
                            createRequire(import.meta.url).resolve("./createTempFile"),
                            keep ? ["keep"] : []);

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
                        `Checking whether temporary file-entries are deleted automatically on \`${nameof(process)}.${nameof(process.exit)}\`…`,
                        async () =>
                        {
                            ok(!await pathExists(files.file));
                        });

                    test(
                        `Checking whether directories with contents are deleted automatically on \`${nameof(process)}.${nameof(process.exit)}\` as well…`,
                        async () =>
                        {
                            ok(!await pathExists(files.dir));
                        });

                    test(
                        `Checking whether temporary files can be kept even after \`${nameof(process)}.${nameof(process.exit)}\` occurs…`,
                        async function()
                        {
                            this.timeout(5 * 1000);
                            this.slow(3 * 1000);

                            await SpawnTestScript(true);
                            ok(await pathExists(files.file));
                            ok(await pathExists(files.dir));
                            await remove(files.file);
                            await remove(files.dir);
                        });
                });

            suite(
                nameof(TempFileSystem.Cleanup),
                () =>
                {
                    test(
                        `Checking whether \`${nameof(TempFileSystem)}\`-objects can be cleaned up manually…`,
                        async () =>
                        {
                            let file = new TempFile();
                            TempFileSystem.Cleanup();
                            ok(file.Disposed);
                            ok(!await pathExists(file.FullName));
                        });

                    test(
                        `Checking whether \`${nameof(TempFileSystem)}\`-objects with \`${nameof<ITempFileSystemOptions>((opt) => opt.Keep)}\` set to \`${true}\` aren't deleted by calling \`${nameof(TempFileSystem.Cleanup)}\`…`,
                        async () =>
                        {
                            let file = new TempFile(
                                {
                                    Keep: true
                                });

                            TempFileSystem.Cleanup();
                            ok(!file.Disposed);
                            ok(await pathExists(file.FullName));
                        });
                });

            suite(
                nameof<TempFileSystem>((fileSystem) => fileSystem.Disposed),
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
                        `Checking whether \`${nameof<TempFileSystem>((fs) => fs.Disposed)}\` initially equals \`${false}\`…`,
                        () =>
                        {
                            strictEqual(tempFile.Disposed, false);
                        });

                    test(
                        `Checking whether \`${nameof<TempFileSystem>((fs) => fs.Disposed)}\` equals \`${true}\` once it has been disposed…`,
                        () =>
                        {
                            tempFile.Dispose();
                            strictEqual(tempFile.Disposed, true);
                        });
                });

            suite(
                nameof<TempFileSystem>((fileSystem) => fileSystem.Dispose),
                () =>
                {
                    test(
                        "Checking whether disposing a temp file-system entry twice throws an exception…",
                        () =>
                        {
                            let file = new TempFile();
                            file.Dispose();
                            throws(() => file.Dispose());
                        });
                });

            suite(
                nameof(TempFileSystem.TempBaseName),
                () =>
                {
                    test(
                        "Checking whether a pattern for creating a base-name can be provided…",
                        () =>
                        {
                            let pattern = /^\d{2,30}test\w*[0-5]{3}$/;

                            ok(
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

                            ok(tempName.startsWith(prefix));
                            ok(tempName.endsWith(suffix));
                            ok(pattern.test(tempName));
                        });

                    test(
                        "Checking whether the temp base-name is not absolute…",
                        () =>
                        {
                            ok(!isAbsolute(TempFileSystem.TempBaseName()));
                        });
                });

            suite(
                nameof(TempFileSystem.TempName),
                () =>
                {
                    test(
                        `Checking whether file-names generated using \`${nameof(TempFileSystem.TempName)}\` are relative to the system's temp-dir by default…`,
                        () =>
                        {
                            let relativePath = relative(tmpdir(), TempFileSystem.TempName());
                            ok(!isAbsolute(relativePath));
                            ok(!relativePath.startsWith(".."));
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
                            ok(!await pathExists(tempName));
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
                            throws(() => TempFileSystem.TempName(options));
                            file.Dispose();
                        });

                    test(
                        `Checking whether paths generated using \`${nameof(TempFileSystem.TempName)}\` are absolute…`,
                        () =>
                        {
                            ok(isAbsolute(TempFileSystem.TempName()));
                        });
                });
        });
}
