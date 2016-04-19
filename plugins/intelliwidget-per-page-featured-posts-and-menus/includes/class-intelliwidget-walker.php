<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * class-intelliwidget-walker.php - IntelliWidget Walker Class
 * based in part on code from Wordpress core post-template.php
 *
 * @package IntelliWidget
 * @subpackage includes
 * @author Jason C Fleming
 * @copyright 2014-2015 Lilaea Media LLC
 * @access public
 */
class Walker_IntelliWidget extends Walker {
	/**
	 * @see Walker::$tree_type
	 * @var string
	 */
	var $tree_type = 'page';

	/**
	 * @see Walker::$db_fields
	 * @var array
	 */
	var $db_fields = array ( 'parent' => 'post_parent', 'id' => 'ID' );

	/**
	 * @see Walker::start_el()
	 *
	 * @param string $output Passed by reference. Used to append additional content.
	 * @param object $page Page data object.
	 * @param int $depth Depth of page in reference to parent pages. Used for padding.
	 * @param array $args Uses 'selected' argument for selected page to set selected HTML attribute for option element.
	 * @param int $id
	 */
	function start_el( &$output, $page, $depth = 0, $args = array(), $id = 0 ) {
        if ( isset( $args[ 'profiles_only' ] ) && $args[ 'profiles_only' ] && empty( $page->has_profile ) ) return;
		$pad = str_repeat( '-&nbsp;', $depth );

		$output .= "\t<option class=\"level-$depth\" value=\"$page->ID\"";
		if ( in_array( $page->ID, $args[ 'page' ] ) )
			$output .= ' selected="selected"';
		$output .= '>';
		$title = substr( $pad . $page->post_title, 0, 60 ) . ' (' . ucwords( str_replace( '_', ' ', $page->post_type ) ) . ')';
		$output .= esc_html( $title );
		$output .= "</option>\n";
	}
}

class Walker_IntelliWidget_Terms extends Walker {
	/**
	 * @see Walker::$tree_type
	 * @var string
	 */
	var $tree_type = 'category';

	/**
	 * @see Walker::$db_fields
	 * @var array
	 */
	var $db_fields = array ( 'parent' => 'parent', 'id' => 'term_taxonomy_id' );

	/**
	 * @see Walker::start_el()
	 *
	 * @param string $output Passed by reference. Used to append additional content.
	 * @param object $page Page data object.
	 * @param int $depth Depth of page in reference to parent pages. Used for padding.
	 * @param array $args Uses 'selected' argument for selected page to set selected HTML attribute for option element.
	 * @param int $id
	 */
	function start_el( &$output, $term, $depth = 0, $args = array(), $id = 0 ) {
		$pad = str_repeat( '-&nbsp;', $depth );
        // fast index for iw query
        $matchval = ( int )$term->term_taxonomy_id;
        $matcharr = $args[ 'terms' ];
		$output .= "\t<option class=\"level-$depth\" value=\"$matchval\"";
		if ( in_array( $matchval, $matcharr ) )
			$output .= ' selected';
		$output .= '>';
		$title = substr( $pad . $term->name, 0, 60 ) . ' (' . ucwords( str_replace( '_', ' ', $term->taxonomy ) ) . ')';
		$output .= esc_html( $title );
		$output .= "</option>\n";
	}
}
