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
this["templates"]["playlist"]["track"]["tmpl"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "<span class=\"free\">FREE</span>";
  },"3":function(depth0,helpers,partials,data) {
  return "<marquee behavior=\"scroll\" direction=\"left\" scrollamount=\"1\">";
  },"5":function(depth0,helpers,partials,data) {
  return "</marquee>";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"track\" data-start=\""
    + escapeExpression(((helper = (helper = helpers.startsAt || (depth0 != null ? depth0.startsAt : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"startsAt","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"links\">\n    <div class=\"now-playing\"><span></span><span></span><span></span></div>\n    <a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\" class=\"download\"><i class=\"fa fa-download\"></i>";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.free : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</a>\n  </div>\n  <div class=\"info\">\n    <div class=\"title\">";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.titleScrolling : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)));
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.titleScrolling : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</div>\n    <div class=\"artist\">";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.artistScrolling : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += escapeExpression(((helper = (helper = helpers.artist || (depth0 != null ? depth0.artist : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"artist","hash":{},"data":data}) : helper)));
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.artistScrolling : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n  </div>\n  <div class=\"download-links\">\n    <a href=\"#\" class=\"download-link itunes\">iTunes</a>\n    <a href=\"#\" class=\"download-link beatport\">Beatport</a>\n    <a href=\"#\" class=\"download-link juno\">Juno Download</a>\n  </div>\n</div>";
},"useData":true});