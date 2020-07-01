Demo.Utils = (function() {
  // Route Implementation
  const initFunction = function(filename) {
    if (filename.indexOf('main') >= 0) {
      Demo.Main.init();
    } else if (filename.indexOf('about') >= 0) {
      Demo.About.init();
    } else if (filename.indexOf('product') >= 0) {
      Demo.Products.init();
    }
    // Add new page for SPA app
    // else if (filename.indexOf('somehing new page'){
    // Demo.Something.init();
    //}
  };

  // **Do not Change this function //
  const changeContents = function(filename, callback) {
    $('#content').load(filename, function(response, status, xhr) {
      if (status == 'error') {
        // var ss = xhr.status;
        // var st = xhr.statusText;
        ;
      } else {
        $('#content').trigger('create');

        initFunction(filename);

        if (callback) {
          callback();
        }
      }
    });
  };
  // **Do not Change this function //

  return {
    changeContents: changeContents,
  };
})();
