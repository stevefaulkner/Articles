jQuery(document).ready(function() {
  
  /* custom highlight.js initialisation */
  jQuery('pre').each(function(i, e) {hljs.highlightBlock(e)});
  
  /* skip link patch for chrome, mainly */
  /* removed, as this was crashing VO/iOS - fixed by adding tabindex=-1 explicitly in HTML instead
  jQuery('#skippy').click(function() {
    var selector=jQuery(this).attr('href');
    if(selector) {
      jQuery(selector).attr('tabindex','-1');
    }
  });
*/

  /* add bootstrap default nice table styling to tables (in blog posts) */
  jQuery('article table').addClass('table table-striped');

  /* add a div around tables in articles to make them scrollable (as main article container has overflow: hidden) (in blog posts) */
  jQuery('article table').wrap('<div class="table-scroller"></div>');

  /* add bootstrap default form control styling to form controls (in blog posts, comments) */
  jQuery('aside input[type!="submit"], #commentform input[type!="submit"], #commentform textarea').addClass('form-control');

  /* twitter code */
  !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

  /* collapse for biogs */
  jQuery('#biogs .panel-collapse').collapse({
    toggle: false
  });

  jQuery('#biogs .panel-collapse').on('show.bs.collapse', function () {
    jQuery('#biogs .panel-collapse').collapse('hide');
  })

  // custom lightbox based on bootstrap modal code by PHL
  jQuery('.luxbox').click(function(e) {
    // stop link from being followed
    e.preventDefault();

    var theModal = jQuery(this).data("target");
    jQuery(theModal+' .modal-content img').attr('src', jQuery(this).attr('href')).attr('alt', jQuery(this).find('img').attr('alt'));
    jQuery(theModal+' .modal-content .description').text(jQuery(this).attr('data-description'));
    jQuery(theModal).modal();
    jQuery(theModal).focus();
  });

});