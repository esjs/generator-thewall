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

    this.log('xtype => ', this.options.xtype, typeof this.options.xtype);
    this.log('edp => ', this.options.edp);
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
};