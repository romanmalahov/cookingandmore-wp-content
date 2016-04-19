<?php get_header(); ?>

<?php include(TEMPLATEPATH . "/sidebar2.php"); ?>

	<div id="content" class="widecolumn">

	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	<?php //var_dump($post->post_title) ?>
<?php /* ?>
		<div class="navigation">
			<div class="alignleft"><?php previous_post_link('&laquo; %link') ?></div>
			<div class="alignright"><?php next_post_link('%link &raquo;') ?></div>
		</div>
<?php */ ?>
		<div class="post" id="post-<?php the_ID(); ?>">
			<h2 style="margin-bottom: 10px;"><?php the_title(); ?></h2>
                        
                        <div id="print-link">
                        <?php if(function_exists('wp_print')) { print_link('Print this Recipe'); } ?>
                        </div>
                        
                        <?php if(function_exists('the_ratings')) { the_ratings(); } ?>
                        
			<div class="entry">
				<?php the_content('<p class="serif">Read the rest of this entry &raquo;</p>'); ?>

				<?php wp_link_pages(array('before' => '<p><strong>Pages:</strong> ', 'after' => '</p>', 'next_or_number' => 'number')); ?>
				<?php the_tags( '<p>Tags: ', ', ', '</p>'); ?>

				<p class="postmetadata alt">
					<small>
						This recipe is filed under <?php the_category(', ') ?>.
						
                                                <?php edit_post_link('Edit this entry.','',''); ?>

					</small>
				</p>
                                
                                <?php if(function_exists('wp_email')) { email_link(); } ?>  
			</div>
		</div>

	<?php comments_template(); ?>

	<?php endwhile; else: ?>

		<p>Sorry, no posts matched your criteria.</p>

<?php endif; ?>

	</div>

<?php get_sidebar(); ?>

<?php get_footer(); ?>
