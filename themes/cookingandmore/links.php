<?php
/*
Template Name: Links
*/
?>

<?php get_header(); ?>

<?php include(TEMPLATEPATH . "/sidebar2.php"); ?>

<div id="content" class="narrowcolumn">

<h2>Links:</h2>
<ul>
<?php wp_list_bookmarks(); ?>
</ul>

</div>

<?php get_footer(); ?>
