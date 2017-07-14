#!/usr/bin/env node 
const program = require('commander');
const checker = require('license-checker');
const path = require('path');
const fs = require('fs');

program
    .name('lcdoc')
    .version('0.0.1')
    .option('-o, --out <path>', 'write the data to a specific file.');

program
    .command('make [path]')
    .action(function(argv) {
        let result = [];
        let workingPath = argv || process.cwd();

        checker.init({
            start: workingPath,
            customFormat: {
                "name": "",
                "version": "",
                "description": "",
                "licenses": "",
                "licenseFile": "none",
                "licenseText": "none",
                "licenseModified": "no"
            },
        }, function(err, items = {}) {
            if (err) {
                console.log(err);
            } else {
                const itemKeys = Object.keys(items);
                itemKeys.forEach((key) => {
                    const item = items[key];
                    const { licenses, licenseFile, licenseText, repository } = item;
                    let textList = [];
                    textList.push(`Package: ${key}`);

                    licenses && textList.push(`License: ${licenses}`);
                    repository && textList.push(`Repository Url: ${repository}`);

                    if (licenseFile) {
                        const parser = path.parse(licenseFile);
                        textList.push(`License Source: ${parser.base}`);
                    }

                    // licenseText && textList.push(`Source Text:\n\n${licenseText}`);

                    // console.log(item);

                    // if (licenseSources && licenseSources.license) {
                    //     const package = licenseSources.package || {};
                    //     const license = licenseSources.license;
                    //     const pSource = package.sources || [];
                    //     const lSource = license.sources || [];

                    //     let licenseUrl = '';

                    //     pSource.forEach((p) => {
                            
                    //         if (p.url) {
                    //             textList.push(`License Url: ${p.url}`);
                    //         }
                    //     });

                    //     lSource.forEach((l) => {
                    //         if (l.filePath) {
                    //             const parser = path.parse(l.filePath);
                    //             textList.push(`License Source: ${parser.base}`);
                    //         }
                    //         if (l.text) {
                    //             textList.push(`Source Text:\n\n${l.text}`);
                    //         }
                    //     });
                    // }
                    result.push(textList.join('\n'));
                });

                const outputPath = program.out;
                const outputText = result.join('\n\n-------------------------------------------------------------------------\n\n');
                if (outputPath) {
                    fs.writeFile(outputPath, outputText, 'utf8', (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`Successfully created file '${outputPath}'.`);
                        }
                    });
                } else {
                    console.log(outputText);
                }
            }
        });
    });

program.parse(process.argv);