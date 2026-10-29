import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, symlink, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { buildPublicSite, PUBLIC_FILES } from '../scripts/build-pages.mjs';

async function fixture(run) {
  const dir = await mkdtemp(join(tmpdir(), 'belentani-pages-'));
  try {
    await mkdir(join(dir, 'noiacore'));
    for (const file of PUBLIC_FILES) {
      await mkdir(dirname(join(dir, file)), { recursive: true });
      await writeFile(join(dir, file), file === 'CNAME' ? 'www.belentani.es' : '<!doctype html><title>Public</title>');
    }
    await writeFile(join(dir, '.env'), 'PRIVATE_TEST_FIXTURE');
    await mkdir(join(dir, '.github'));
    await writeFile(join(dir, '.github', 'private-config.yml'), 'not for publication');
    await mkdir(join(dir, 'tests'));
    await writeFile(join(dir, 'tests', 'test.mjs'), 'not for publication');
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test('public bundle includes exactly the whitelisted static pages and CNAME', async () => {
  await fixture(async (dir) => {
    const published = await buildPublicSite(dir);
    assert.deepEqual(published, PUBLIC_FILES);
    const top = (await readdir(join(dir, '_site'))).sort();
    assert.deepEqual(top, ['CNAME', 'artista', 'ecosistema.html', 'editorial.css', 'index.html', 'noiacore', 'prensa']);
    assert.deepEqual(await readdir(join(dir, '_site', 'artista')), ['index.html']);
    assert.deepEqual(await readdir(join(dir, '_site', 'prensa')), ['index.html']);
    assert.deepEqual(await readdir(join(dir, '_site', 'noiacore')), ['index.html']);
    assert.equal(await readFile(join(dir, '_site', 'CNAME'), 'utf8'), 'www.belentani.es');
  });
});

test('missing required public files fail closed rather than silently publishing an incomplete site', async () => {
  await fixture(async (dir) => {
    await rm(join(dir, 'ecosistema.html'));
    await assert.rejects(buildPublicSite(dir), /ENOENT/);
    await assert.rejects(readdir(join(dir, '_site')), /ENOENT/);
  });
});

test('symlinked site content is rejected', async () => {
  await fixture(async (dir) => {
    await rm(join(dir, 'index.html'));
    await symlink(join(dir, '.env'), join(dir, 'index.html'));
    await assert.rejects(buildPublicSite(dir), /Unsafe or missing public file/);
    await assert.rejects(readdir(join(dir, '_site')), /ENOENT/);
  });
});
