<?php
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * excerpts.php - Template for basic featured post list
 *
 * This can be copied to a folder named 'intelliwidget' in your theme
 * to customize the output.
 *
 * @package IntelliWidget
 * @subpackage templates
 * @author Jason C Fleming
 * @copyright 2014-2015 Lilaea Media LLC
 * @access public
 */
if ( $selected->have_posts() ) : while ( $selected->have_posts() ) : $selected->the_post();
?>

<div id="intelliwidget_<?php the_intelliwidget_ID(); ?>" class="intelliwidget-excerpt-container">
  <?php if ( has_intelliwidget_image() ) : ?>
  <div class="intelliwidget-image-container intelliwidget-image-container-<?php echo $instance[ 'image_size' ];?> intelliwidget-align-<?php echo $instance[ 'imagealign' ]; ?>">
    <?php the_intelliwidget_image(); ?>
  </div>
  <?php endif; ?>
  <h3 id="intelliwidget_title_<?php the_intelliwidget_ID(); ?>" class="intelliwidget-title">
    <?php the_intelliwidget_link(); ?>
  </h3>
  <div id="intelliwidget_excerpt_<?php the_intelliwidget_ID(); ?>" class="intelliwidget-excerpt">
    <?php the_intelliwidget_excerpt();?>
    <span id="intelliwidget_more_link_<?php the_intelliwidget_ID(); ?>" class="intelliwidget-more-link">
    <?php the_intelliwidget_link( get_the_intelliwidget_ID(), $instance[ 'link_text' ] ); ?>
    </span> </div>
  <div style="clear:both"></div>
</div>
<?php endwhile; endif; ?>
