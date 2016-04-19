<?php

/*

Template Name: News Articles

*/

?>



<?php get_header(); ?>

<?php include(TEMPLATEPATH . "/sidebar2.php"); ?>


<div id="content" class="narrowcolumn">



<h2>Tina in Print:</h2>

<ul id="published-articles">

<?php wp_list_bookmarks('title_li=&categorize=0&category=10&show_description=1'); ?>

</ul>



</div>



<?php get_sidebar(); ?>

<?php get_footer(); ?>

