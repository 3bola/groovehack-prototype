this["templates"] = this["templates"] || {};
this["templates"]["example"] = this["templates"]["example"] || {};
this["templates"]["example"]["tmpl"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<h1>"
    + escapeExpression(((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper)))
    + "</h1>";
},"useData":true});
this["templates"]["playlist"] = this["templates"]["playlist"] || {};
this["templates"]["playlist"]["track"] = this["templates"]["playlist"]["track"] || {};
this["templates"]["playlist"]["track"]["tmpl"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"track\" data-start=\""
    + escapeExpression(((helper = (helper = helpers.startsAt || (depth0 != null ? depth0.startsAt : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"startsAt","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"links\">\n    <div class=\"now-playing\"><span></span><span></span><span></span></div>\n    <a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\" class=\"download\"><i class=\"fa fa-download\"></i></a>\n  </div>\n  <div class=\"title\">"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n  <div class=\"artist\">"
    + escapeExpression(((helper = (helper = helpers.artist || (depth0 != null ? depth0.artist : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"artist","hash":{},"data":data}) : helper)))
    + "</div>\n</div>";
},"useData":true});