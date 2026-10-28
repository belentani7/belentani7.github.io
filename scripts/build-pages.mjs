import { copyFile, lstat, mkdir, realpath } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Deliberately publish only the pages that form this static site.
 * Never deploy the repository root: it includes tests, workflows and policies.
 */
export const PUBLIC_FILES = Object.freeze([
  'index.html',
  'ecosistema.html',
  'noiacore/index.html',
  'CNAME',
]);

export async function buildPublicSite(root = process.cwd(), destination = join(root, '_site')) {
  const sourceRoot = await realpath(root);
  const output = resolve(destination);
  if (output === sourceRoot || sourceRoot.startsWith(output + sep)) {
    throw new Error('Output must not overwrite a source directory');
  }

  const checked = [];
  for (const name of PUBLIC_FILES) {
    const path = join(sourceRoot, name);
    const relativeDir = dirname(name);
    if (relativeDir !== '.') {
      const parent = await lstat(join(sourceRoot, relativeDir));
      if (parent.isSymbolicLink() || !parent.isDirectory()) {
        throw new Error(`Unsafe public directory: ${relativeDir}`);
      }
    }
    const info = await lstat(path);
    if (!info.isFile() || info.isSymbolicLink()) {
      throw new Error(`Unsafe or missing public file: ${name}`);
    }
    checked.push({ name, path });
  }

  // A fresh output directory eliminates stale files from earlier builds.
  await mkdir(output);
  for (const { name, path } of checked) {
    const outputFile = join(output, name);
    await mkdir(dirname(outputFile), { recursive: true });
    await copyFile(path, outputFile);
  }
  return checked.map(({ name }) => name);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  buildPublicSite().then((files) => {
    process.stdout.write(`Public static site: ${files.join(', ')}\n`);
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
