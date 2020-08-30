import { TempDirectoryTests } from "./TempDirectory.test";
import { TempFileTests } from "./TempFile.test";

suite(
    "TempFileSystem",
    () =>
    {
        TempFileTests();
        TempDirectoryTests();
    });
