var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    /**
     * Adds support for a '--edp' flag
     * 
     * Create only EDP modules
     */ 
    this.option('edp');

    /**
     * xtype for newly created module
     */
    this.argument('xtype', {
      type: String,
      required: true
    });

    this.options.ies = this.options.xtype.charAt(this.options.xtype.length - 1) === 'y';

    this.log('Selected xtype: ', this.options.xtype);
  }

  prompting() {
    var xtype = this.options.xtype;
    
    return this.prompt([
      {
        type: 'input',
        name: 'xtypePlural',
        message: 'Enter plural for xtype.',
        default: this.options.ies
                  ? xtype.substr(0, xtype.length - 1) + 'ies'
                  : xtype + 's'
      }, {
        type: 'input',
        name: 'XtypeCapitalized',
        message: 'Enter uppercased version of module.',
        default: xtype.charAt(0).toUpperCase() + xtype.substr(1)
      }, {
        type: 'input',
        name: 'xtypeApi',
        message: 'Enter api key for module, required for routing.',
        default: xtype
      }, {
        type: 'input',
        name: 'XtypeCapitalizedPlural',
        message: 'Enter uppercased plural version of module.',
        default: this.options.ies
                  ? xtype.charAt(0).toUpperCase() + xtype.substr(1, xtype.length - 2) + 'ies'
                  : xtype.charAt(0).toUpperCase() + xtype.substr(1) + 's'
      }, {
        type: 'input',
        name: 'idProperty',
        message: 'Enter idProperty for module.',
        default: xtype + '_id'
      }, {
        type: 'input',
        name: 'idPropertyEdp',
        message: 'Enter idPropertyEdp for module.',
        default: xtype + '_edition_id'
      }
    ]).then(answers => {
      this.options.answers = answers;
    })
  }

  generate() {
    var answers = Object.assign({}, this.options.answers, {
      xtype: this.options.xtype,
      edpOnly: this.options.edp
    });

    this._generateModels(answers);
    this._generateProxies(answers);
    this._generateViews(answers);

    if (!this.options.edp) {
      this._generateImportViews(answers);
      this._generateCdpViews(answers);
    }

    this._updateApplication(answers);

    this._updateNavigation(answers);
  }

  _generateModels(answers) {
    this.fs.copyTpl(
      this.templatePath('app/model/Model.ejs'),
      this.destinationPath(`app/model/${answers.xtypePlural}/Model${answers.XtypeCapitalizedPlural}.js`),
      answers
    );

    if (this.options.edp) return;

    this.fs.copyTpl(
      this.templatePath('app/model/cdp/ModelCdp.ejs'),
      this.destinationPath(`app/model/${answers.xtypePlural}/cdp/ModelCdp${answers.XtypeCapitalizedPlural}.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath('app/model/_import/ModelImport.ejs'),
      this.destinationPath(`app/model/${answers.xtypePlural}/_import/ModelImport${answers.XtypeCapitalizedPlural}.js`),
      answers
    );
  }

  _generateProxies(answers) {
    this.fs.copyTpl(
      this.templatePath('app/proxy/Proxy.ejs'),
      this.destinationPath(`app/proxy/${answers.xtypePlural}/Proxy${answers.XtypeCapitalizedPlural}.js`),
      answers
    );
  }

  _generateViews(answers) {
    var basePath = 'classic/src/view';

    // Browse
    this.fs.copyTpl(
      this.templatePath(`${basePath}/View.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/${answers.XtypeCapitalizedPlural}.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/ViewGrid.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/${answers.XtypeCapitalizedPlural}Grid.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/ViewGridBase.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/${answers.XtypeCapitalizedPlural}GridBase.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/GridColumnsCfg.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/GridColumnsCfg.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/ViewCtrlGrid.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/ViewCtrl${answers.XtypeCapitalizedPlural}Grid.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/ViewCtrlGrid.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/ViewCtrl${answers.XtypeCapitalizedPlural}GridBase.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/ViewModel.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/ViewModel${answers.XtypeCapitalizedPlural}.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/ViewModelGrid.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/ViewModel${answers.XtypeCapitalizedPlural}Grid.js`),
      answers
    );

    // Forms
    this.fs.copyTpl(
      this.templatePath(`${basePath}/forms/AddEditBaseForm.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/forms/AddEdit${answers.XtypeCapitalized}BaseForm.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/forms/AddEditDetailForm.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/forms/AddEdit${answers.XtypeCapitalized}DetailForm.js`),
      answers
    );

    // Detail
    this.fs.copyTpl(
      this.templatePath(`${basePath}/detail/Detail.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/detail/${answers.XtypeCapitalized}Detail.js`),
      answers
    );
  }

  _generateImportViews(answers) {
    var basePath = 'classic/src/view';

    // Browse
    this.fs.copyTpl(
      this.templatePath(`${basePath}/_import/Import.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/_import/Import${answers.XtypeCapitalizedPlural}.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/_import/ImportGrid.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/_import/Import${answers.XtypeCapitalizedPlural}Grid.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/_import/ViewCtrlImportGrid.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/_import/ViewCtrlImport${answers.XtypeCapitalizedPlural}Grid.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/_import/ViewModelImport.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/_import/ViewModelImport${answers.XtypeCapitalizedPlural}.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/_import/ViewModelImportGrid.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/_import/ViewModelImport${answers.XtypeCapitalizedPlural}Grid.js`),
      answers
    );

    // Detail
    this.fs.copyTpl(
      this.templatePath(`${basePath}/detail/CdpDetail.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/detail/Cdp${answers.XtypeCapitalized}Detail.js`),
      answers
    );
  }

  _generateCdpViews(answers) {
    var basePath = 'classic/src/view';

    // Browse
    this.fs.copyTpl(
      this.templatePath(`${basePath}/cdp/Cdp.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/cdp/Cdp${answers.XtypeCapitalizedPlural}.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/cdp/CdpGrid.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/cdp/Cdp${answers.XtypeCapitalizedPlural}Grid.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/cdp/ViewCtrlCdpGrid.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/cdp/ViewCtrlCdp${answers.XtypeCapitalizedPlural}Grid.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/cdp/ViewModelCdp.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/cdp/ViewModelCdp${answers.XtypeCapitalizedPlural}.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/cdp/ViewModelCdpGrid.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/cdp/ViewModelCdp${answers.XtypeCapitalizedPlural}Grid.js`),
      answers
    );

    // Forms
    this.fs.copyTpl(
      this.templatePath(`${basePath}/forms/AddEditCdpBaseForm.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/forms/AddEditCdp${answers.XtypeCapitalized}BaseForm.js`),
      answers
    );

    this.fs.copyTpl(
      this.templatePath(`${basePath}/forms/AddEditCdpDetailForm.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/forms/AddEditCdp${answers.XtypeCapitalized}DetailForm.js`),
      answers
    );

    // Detail
    this.fs.copyTpl(
      this.templatePath(`${basePath}/detail/Import.ejs`),
      this.destinationPath(`${basePath}/${answers.xtypePlural}/detail/Import${answers.XtypeCapitalized}.js`),
      answers
    );
  }

  _updateApplication(answers) {
    var appPath = this.destinationPath('classic/src/Application.js'),
        appContent = this.fs.read(appPath),
        modulePlacehoder = '/* %%module_placeholder%% */',
        cdpModulePlacehoder = '/* %%cdp_module_placeholder%% */',
        importModulePlacehoder = '/* %%import_module_placeholder%% */';

    if (!appContent.includes(modulePlacehoder)) {
      this.log('Cannot find placehoder for module in Application.js');
      return;
    }

    appContent = appContent.replace(modulePlacehoder, [
      `'${answers.xtypePlural}.${answers.XtypeCapitalizedPlural}',`,
      `'${answers.xtypePlural}.detail.${answers.XtypeCapitalized}Detail',`,
      '',
      modulePlacehoder
    ].join('\n    '));


    if (!this.options.edp) {
      if (!appContent.includes(cdpModulePlacehoder)) {
        this.log('Cannot find placehoder for CDP module in Application.js');
        return;
      }

      appContent = appContent.replace(cdpModulePlacehoder, [
        `'${answers.xtypePlural}.cdp.Cdp${answers.XtypeCapitalizedPlural}',`,
        `'${answers.xtypePlural}.detail.Cdp${answers.XtypeCapitalized}Detail',`,
        '',
        cdpModulePlacehoder
      ].join('\n    '));


      if (!appContent.includes(importModulePlacehoder)) {
        this.log('Cannot find placehoder for Import module in Application.js');
        return;
      }

      appContent = appContent.replace(importModulePlacehoder, [
        `'${answers.xtypePlural}._import.Import${answers.XtypeCapitalizedPlural}',`,
        `'${answers.xtypePlural}.detail.Import${answers.XtypeCapitalized}',`,
        '',
        importModulePlacehoder
      ].join('\n    '));
    }
    
    this.fs.write(appPath, appContent);
  }

  _updateNavigation(answers) {
    var navPath = this.destinationPath('app/store/Navigation.js'),
        navContent = this.fs.read(navPath),
        moduleApiPlaceholder = '/* %%module_api%% */',
        modulePlacehoder = '/* %%module_placeholder%% */',
        cdpModulePlacehoder = '/* %%cdp_module_placeholder%% */',
        importContent = '',
        importApiContent = '';

    if (!navContent.includes(modulePlacehoder)) {
      this.log('Cannot find placehoder for module in Navigation.js');
      return;
    }

    if (!this.options.edp) {
      // Formatting is important to preserve indentation
      importContent = `, {
            text: Ext.String.format(i18n.importEntities, i18n.${answers.xtypePlural}),
            view: '${answers.xtypePlural}._import.Import${answers.XtypeCapitalizedPlural}',
            leaf: true,
            iconCls: 'x-fa fa-sign-in',
            routeId: 'import${answers.xtypePlural}',
            browseRequirements: [
              'import${answers.xtypePlural}.read'
            ]
          }, {
            // text: Ext.String.format(i18n.importEntities, i18n.${answers.xtype}),
            view: '${answers.xtypePlural}.detail.Import${answers.XtypeCapitalized}',
            leaf: true,
            iconCls: 'x-fa fa-sign-in',
            routeId: 'import${answers.xtype}',
            browseRequirements: [
              'cdp${answers.xtypePlural}.detail'
            ]
          }`;
    }

    // Formatting is important to preserve indentation
    navContent = navContent.replace(modulePlacehoder, `, {
        text: i18n.${answers.xtypePlural},
        view: '${answers.xtypePlural}.${answers.XtypeCapitalizedPlural}',
        iconCls: 'x-fa fa-star-o',
        routeId: '${answers.xtypePlural}',
        browseRequirements: [
          '${answers.xtypePlural}.read'
        ],
        children: [
          {
            // text: Ext.String.format(i18n.createEntity, i18n.${answers.xtype}),
            view: '${answers.xtypePlural}.detail.${answers.XtypeCapitalized}Detail',
            leaf: true,
            iconCls: 'x-fa fa-plus',
            routeId: '${answers.xtype}',
            browseRequirements: [
              '${answers.xtypePlural}.detail'
            ]
          }${importContent}
        ]
      }${modulePlacehoder}`);

    if (!navContent.includes(moduleApiPlaceholder)) {
      this.log('Cannot find placehoder for API in Navigation.js');
    } else {
      if (!this.options.edp) {
        // Formatting is important to preserve indentation
        importApiContent = `
  cdp${answers.xtypePlural}: {
    create   : '/api/${answers.xtypeApi}/cdp-save/',
    read     : '/api/${answers.xtypeApi}/cdp-browse/',
    update   : '/api/${answers.xtypeApi}/cdp-save/',
    destroy  : '/api/${answers.xtypeApi}/cdp-delete/',
    detail   : '/api/${answers.xtypeApi}/cdp-detail/'
  },
  import${answers.xtypePlural}: {
    create   : '/api/${answers.xtypeApi}/import/',
    read     : '/api/${answers.xtypeApi}/import-browse/'
  },`;
      }

      // Formatting is important to preserve indentation
      navContent = navContent.replace(moduleApiPlaceholder, `
  ${answers.xtypePlural}: {
    create   : '/api/${answers.xtypeApi}/edp-save/',
    read     : '/api/${answers.xtypeApi}/edp-browse/',
    update   : '/api/${answers.xtypeApi}/edp-save/',
    destroy  : '/api/${answers.xtypeApi}/edp-delete/',
    detail   : '/api/${answers.xtypeApi}/edp-detail/'
  },${importApiContent}
  ${moduleApiPlaceholder}`);
    }

    if (!navContent.includes(cdpModulePlacehoder)) {
      this.log('Cannot find placehoder for CDP module in Navigation.js');
    } else if (!this.options.edp) {
      // Formatting is important to preserve indentation
      navContent = navContent.replace(cdpModulePlacehoder, `, {
        text: i18n.${answers.xtypePlural},
        view: '${answers.xtypePlural}.cdp.Cdp${answers.XtypeCapitalizedPlural}',
        iconCls: 'x-fa fa-star-o',
        routeId: 'cdp${answers.xtypePlural}',
        browseRequirements: [
          'cdp${answers.xtypePlural}.read'
        ],
        children: [
          {
            text: Ext.String.format(i18n.createEntity, i18n.${answers.xtype}),
            view: '${answers.xtypePlural}.detail.Cdp${answers.XtypeCapitalized}Detail',
            leaf: true,
            iconCls: 'x-fa fa-plus',
            routeId: 'cdp${answers.xtype}',
            browseRequirements: [
              'cdp${answers.xtypePlural}.detail'
            ]
          }
        ]
      }${cdpModulePlacehoder}`);
    }

    this.fs.write(navPath, navContent);
  }
};