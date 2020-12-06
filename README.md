# berry-repro

From `tools/module`.

`yarn build` - works

`yarn doit` - reports the following
```
❯ yarn build
❯ yarn doit
internal/process/esm_loader.js:74
    internalBinding('errors').triggerUncaughtException(
                              ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'kleur' imported from /home/samantha/github/berry-repro/tools/module/dist/bin/module-build.js
Did you mean to import kleur-npm-4.1.3-258cc52fe1-2f7c8faa80.zip/node_modules/kleur/index.js?
    at packageResolve (internal/modules/esm/resolve.js:655:9)
    at moduleResolve (internal/modules/esm/resolve.js:696:18)
    at Loader.defaultResolve [as _resolve] (internal/modules/esm/resolve.js:810:11)
    at Loader.resolve (internal/modules/esm/loader.js:85:40)
    at Loader.getModuleJob (internal/modules/esm/loader.js:229:28)
    at ModuleWrap.<anonymous> (internal/modules/esm/module_job.js:51:40)
    at link (internal/modules/esm/module_job.js:50:36) {
  code: 'ERR_MODULE_NOT_FOUND'
}
```
