<?php

/*

Template Name: Web Links

*/

?>



<?php get_header(); ?>

<?php include(TEMPLATEPATH . "/sidebar2.php"); ?>

<div id="content" class="narrowcolumn">



<h2>Web Links:</h2>

<ul>

<?php wp_list_bookmarks('category=12,13,14,15,16,17&show_description=1'); ?>

</ul>



</div>

<?php get_sidebar(); ?>

<?php get_footer(); ?>

