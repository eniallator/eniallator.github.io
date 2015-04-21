$(document).ready(function() {

  var clip = new ZeroClipboard($(".copy-button"));

  clip.on("ready", function() {
    this.on("aftercopy", function() {
      $(".copy-button")
        .tooltip('fixTitle')
        .data('bs.tooltip')
        .$tip.find('.tooltip-inner')
        .text("Copied");
    });
  });
});