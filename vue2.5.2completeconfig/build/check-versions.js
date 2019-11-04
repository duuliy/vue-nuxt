'use strict'
const chalk = require('chalk')     // 用于在控制台输出高亮字体的插件
const semver = require('semver')     // 语义化版本检查插件
const packageConfig = require('../package.json')   // 引入package.json                     //主要是命令行的配置
const shell = require('shelljs')        //引入shelljs  报告工具或测试的错误等

function exec (cmd) {            // 开辟子进程执行指令cmd并返回结果
  return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [           // node和npm版本需求
  {
    name: 'node',
    currentVersion: semver.clean(process.version), //使用semver格式化版本
    versionRequirement: packageConfig.engines.node  //"engines": {"node": ">= 6.0.0", 获取package.json中设置的node版本
  }
]

if (shell.which('npm')) {       // 开辟子进程执行指令npm并返回结果
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'), // 自动调用npm --version命令，并且把参数返回给exec函数，从而获取纯净的版本号
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []
     // 依次判断版本是否符合要求
  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      // 如果现有的npm或者node的版本比定义的版本低，则生成一段警告
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    // 如果有警告则将其输出到控制台
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1)       //退出'进程'
  }
}
