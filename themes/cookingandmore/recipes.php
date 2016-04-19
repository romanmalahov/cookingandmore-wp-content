<?php
/*

Template Name: Recipes

*/?>

<?php get_header(); ?>

<?php include(TEMPLATEPATH . "/sidebar2.php"); ?>

<div id="content" class="narrowcolumn">

<?php get_a_post('GETSTICKY'); ?>
	<h2>Featured recipe: <?php the_title(); ?></h2>
        <br />
	<?php wswwpx_content_extract ('(Full recipe...)'); ?>

<h2>Recipes by category:</h2>
<br/>
<?php wp_list_categories('show_count=1&child_of=18&title_li='); ?>

<?php /* ?>
<h2>Recipes by keyword:</h2>
<br/>
<?php wp_tag_cloud('smallest=10&largest=36&'); ?>
<?php */ ?>
<h2>Search:</h2>

<?php include (TEMPLATEPATH . '/searchform.php'); ?>

</div>

<?php get_sidebar(); ?>

<?php get_footer(); ?>