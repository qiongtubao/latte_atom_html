var CompositeDisposable = require("atom").CompositeDisposable;
var HtmlView = require("./htmlView");
var url = require("url");
(function(){
  this.activate  = function(state) {
    this.subscriptions = new CompositeDisposable;
    //设置html:openHTML事件
    /**
      this.subscriptions.add(atom.commands.add("atom-workspace",
        "html:openHTML", function(){
          self.toggle();
        }
      ));
    */
    var self = this;
    //html:openTheHTML 事件
    this.subscriptions.add(atom.commands.add("atom-workspace", "html:openTheHTML", function(e){
        self.toggle(e.target.dataset.path);
    }));
    return atom.workspace.addOpener(function(uriToOpen) {
      var error, error1, error2, host, pathname, protocol, ref;
      try {
        ref = url.parse(uriToOpen);
        protocol = ref.protocol;
        host = ref.host;
        pathname = ref.pathname;
      }catch(error1) {
        error = error1;
        return;
      }
      if(protocol !== "latte-html:") {
        return;
      }
      try {
        if(pathname) {
          pathname = decodeURI(pathname);
        }
      }catch(error2) {
        error = error2;
        return;
      }
      /**
      if(host === "editor") {
        return new HtmlView({
          editorId: pathname.substring(1)
        });
      }else{
      */
        return new HtmlView({
          filePath: pathname
        });
      //}
    });
  }
  this.open = function(uri) {
    previousActivePane = atom.workspace.getActivePane();
    return atom.workspace.open(uri, {
      split: "right",
      searchAllPanes: true
    }).done(function(htmlView) {
      if(htmlView instanceof HtmlView) {
        htmlView.renderHTML();
        return previousActivePane.activate();
      }
    });
  }
  this.close = function(uri) {
    previewPane = atom.workspace.paneForURI(uri);
    if(previewPane) {
      //如果已经打开了就关闭
      previewPane.destroyItem(previewPane.itemForURI(uri));
      return true;
    }
    return false;
  }
  this.toggle = function(filePath){
    /**
    var editor, previewPane, previousActivePane, uri;
    editor = editor || atom.workspace.getActiveTextEditor();
    if(editor == null) {
      return;
    }
    */



      var uri = "latte-html://file" + filePath;
      if(!this.close(uri)) {
        return this.open(uri);
      }

  }
}).call(module.exports);
