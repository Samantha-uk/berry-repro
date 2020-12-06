#!/bin/env node
/* eslint-disable no-console */
import { cyan, red, green, blue } from "kleur";
import { readFileSync } from "fs";
import * as rollup from "rollup";
import autoExternal from "rollup-plugin-auto-external";
import commonjs from "@rollup/plugin-commonjs";
import del from "rollup-plugin-delete";
import meow from "meow";
import nodeResolve from "@rollup/plugin-node-resolve";
import path from "path";
import sizes from "rollup-plugin-sizes";
import ts from "@wessberg/rollup-plugin-ts";

interface CommandLineFlags {
  watch: boolean;
}

const extensions = [`.ts`, `.js`, `.jsx`, `.es6`, `.es`, `.mjs`];

let watchOptions: false | rollup.WatcherOptions = false;
// Setup progress reporting
const displayProgress = () => ({
  name: `module-build`,

  moduleParsed(moduleInfo: rollup.ModuleInfo) {
    console.log(`${path.basename(moduleInfo.id)}: ${green(`parsed`)}`);
  },

  watchChange(id: string, change: { event: `create` | `update` | `delete` }) {
    console.log(`${path.basename(id)}: ${blue(`${change}d`)}`);
  },
});

export async function main(flags: CommandLineFlags) {
  if (flags.watch) {
    watchOptions = {
      buildDelay: 0,
      clearScreen: false,
      include: `src/**`,
    } as rollup.WatcherOptions;
  }

  console.log(
    `module-build:${watchOptions ? blue(`watch mode`) : ``}\n${process.cwd()}`
  );

  const packageJSON = JSON.parse(readFileSync(`./package.json`, `utf8`));

  const inputOptions: rollup.InputOptions = {
    input: packageJSON.source,
    watch: watchOptions,
    external: packageJSON.external,
    treeshake: false,
    plugins: [
      del({
        targets: `dist/*`,
        runOnce: true,
      }),
      displayProgress(),
      autoExternal(),
      commonjs(),
      ts({
        tsconfig: {
          declaration: true,
          declarationMap: true,
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          importHelpers: true,
          isolatedModules: true,
          lib: [`dom`, `DOM.Iterable`, `WebWorker`, `ESNext`],
          module: `ESNext`,
          moduleResolution: `node`,
          noEmit: false,
          noFallthroughCasesInSwitch: false,
          noImplicitReturns: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          rootDir: `./src`,
          skipLibCheck: true,
          sourceMap: true,
          strict: true,
          target: `ESNext`,
        },
      }),
      nodeResolve({ extensions, preferBuiltins: false }),
      sizes({ details: true }),
    ],
  };

  const outputOptions: rollup.OutputOptions = {
    file: packageJSON.module,
    format: `es`,
    sourcemap: true,
  };

  try {
    if (!watchOptions) {
      const bundle = await rollup.rollup(inputOptions);
      await bundle.write(outputOptions);
    } else {
      const watcher = rollup.watch({
        input: inputOptions,
        output: outputOptions,
        watch: watchOptions,
      } as rollup.RollupWatchOptions);
      watcher.on(`event`, (event) => {
        switch (event.code) {
          case `START`:
            console.log(`watch:${green(`START`)}`);
            break;
          case `BUNDLE_START`:
            console.log(`watch:${green(`BUNDLE_START`)}`);
            break;
          case `BUNDLE_END`:
            console.log(`module-build:${cyan(`BUNDLE_END`)}`);
            break;
          case `END`:
            console.log(`module-build:${cyan(`END`)}`);
            break;
          case `ERROR`:
            console.log(`module-build:${red(`ERROR`)}`);
            break;

          // no default
        }
      });
    }
  } catch {
    process.exitCode = 1;
  }
}

const cli = meow(
  `
	Usage
	  $ module-build

	Options
    --watch      Watch files in bundle and rebuild on changes.
`,
  {
    flags: {
      watch: {
        type: `boolean`,
      },
    },
  }
);

main(cli.flags as CommandLineFlags);
/* eslint-enable no-console */
