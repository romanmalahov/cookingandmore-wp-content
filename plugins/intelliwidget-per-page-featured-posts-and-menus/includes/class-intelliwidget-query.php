<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * class-intelliwidget-query.php - IntelliWidget Query Class
 * based in part on code from Wordpress core post.php and query.php
 *
 * @package IntelliWidget
 * @subpackage includes
 * @author Jason C Fleming
 * @copyright 2014-2015 Lilaea Media LLC
 * @access public
 */
class IntelliWidget_Query {
    
    var $post;
    var $posts;
    var $post_count   = 0;
    var $in_the_loop  = FALSE;
    var $current_post = -1;
    var $postmeta;
    
    function __construct() {
    }
    
	/**
	 * Set up the next post and iterate current post index.
	 *
	 * @return next post.
	 */
	function next_post() {

		$this->current_post++;

		$this->post = $this->posts[ $this->current_post ];
		return $this->post;
	}
	/**
	 * Whether there are more posts available in the loop.
	 *
	 *
	 * @return bool True if posts are available, FALSE if end of loop.
	 */
	function have_posts() {
		if ( $this->current_post + 1 < $this->post_count ) {
			return TRUE;
		} elseif ( $this->current_post + 1 == $this->post_count && $this->post_count > 0 ) {
			// Do some cleaning up after the loop
			$this->rewind_posts();
		}

		$this->in_the_loop = FALSE;
		return FALSE;
	}

	/**
	 * Rewind the posts and reset post index.
	 *
	 */
	function rewind_posts() {
		$this->current_post = -1;
		if ( $this->post_count > 0 ) {
			$this->post = $this->posts[ 0 ];
		}
	}


	/**
	 * Sets up the current post.
	 *
	 * Retrieves the next post, sets up the post, sets the 'in the loop'
	 * property to TRUE.
	 *
	 * @uses $intelliwidget_post
	 */
	function the_post() {
		$this->in_the_loop = TRUE;

		if ( -1 == $this->current_post ){ // loop has just started
            // stub for future functionality
        }
		global $intelliwidget_post;
		$intelliwidget_post = $this->next_post();
	}
    /* Intelliwidget has a lot of internal logic that can't be done efficiently using the standard
     * WP_Query parameters. This function dyanamically builds a custom query so that the majority of the 
     * post and postmeta data can be retrieved in two optimized db queries.
     */
    function iw_query( $instance = NULL ) {
        if ( empty( $instance ) ) return;
        global $wpdb, $post;
        $select = "
SELECT DISTINCT
    p1.ID
FROM {$wpdb->posts} p1
        ";
        $joins = array( "
LEFT JOIN {$wpdb->postmeta} pm1 ON pm1.post_id = p1.ID
    AND pm1.meta_key = 'intelliwidget_expire_date'
            ", "
LEFT JOIN {$wpdb->postmeta} pm2 ON pm2.post_id = p1.ID
    AND pm2.meta_key = 'intelliwidget_event_date'
            ", );
        if( !empty( $instance[ 'include_private' ] ) && current_user_can( 'read_private_posts' ) ):
            $clauses = array(
                "(p1.post_status = 'publish' OR p1.post_status = 'private' )",
                "(p1.post_password = '' OR p1.post_password IS NULL)",
            );
        else:
            $clauses = array(
                "(p1.post_status = 'publish')",
                "(p1.post_password = '' OR p1.post_password IS NULL)",
            );
        endif;
        // taxonomies
        $prepargs = array();
        // backward compatibility: support category term ids
        if ( isset( $instance[ 'category' ] ) && '' != $instance[ 'category' ] && -1 != $instance[ 'category' ] ):
            $clauses[] = '( tx2.term_id IN ('. $this->prep_array( $instance[ 'category' ], $prepargs, 'd' ) . ') )';
            $joins[] = "INNER JOIN {$wpdb->term_relationships} tx1 ON p1.ID = tx1.object_id " . 
                "INNER JOIN {$wpdb->term_taxonomy} tx2 ON tx2.term_taxonomy_id = tx1.term_taxonomy_id 
                    AND tx2.taxonomy = 'category'";
        // otherwise use new terms instead
        elseif ( isset( $instance[ 'terms' ] ) && $instance[ 'terms' ] && -1 != $instance[ 'terms' ] ):
            $terms = $this->prep_array( $instance[ 'terms' ], $prepargs, 'd' );
            if ( isset( $instance[ 'allterms' ] ) && $instance[ 'allterms' ] ):
    			$clauses[] = '((
					SELECT COUNT(1)
					FROM ' . $wpdb->term_relationships . '
					WHERE term_taxonomy_id IN (' . $terms . ')
					AND object_id = p1.ID
				) = ' . count( $instance[ 'terms' ] ) . ')';
            else:
                $clauses[] = '( tx1.term_taxonomy_id IN ('. $terms . ') )';
                $joins[] = "INNER JOIN {$wpdb->term_relationships} tx1 ON p1.ID = tx1.object_id ";
            endif;
        endif;
        
        // specific posts
        if ( !empty( $instance[ 'page' ] ) ):
            $clauses[] = '(p1.ID IN ('. $this->prep_array( $instance[ 'page' ], $prepargs, 'd' ) . ') )';
        endif;
        /* Remove current page from list of pages if set */
        if ( $instance[ 'skip_post' ] && !empty( $post ) ):
            $clauses[] = "(p1.ID != %d )";
            $prepargs[] = $post->ID;
        endif;
        
        // post types
        if ( empty( $instance[ 'post_types' ] ) ):
            $instance[ 'post_types' ] = 'none';
        endif;
        $clauses[] = '(p1.post_type IN ('. $this->prep_array( $instance[ 'post_types' ], $prepargs ) . ') )';
        // time-based clauses //
        
        $time_adj = gmdate( 'Y-m-d H:i', current_time( 'timestamp' ) );

        // skip all expired posts
        // postmeta intelliwidget_expire_date date format 
        // MUST be YYYY-MM-DD HH:MM for this to work correctly!
        if ( $instance[ 'skip_expired' ] ):
            $clauses[] = "(pm1.meta_value IS NULL OR (pm1.meta_value IS NOT NULL AND CAST( pm1.meta_value AS CHAR ) > '" . $time_adj . "'))";
        endif;
        // show posts that have not started yet only
        // postmeta intelliwidget_event_date date format 
        // MUST be YYYY-MM-DD HH:MM for this to work correctly!
        if ( $instance[ 'future_only' ] ):
            $clauses[] = "(pm2.meta_value IS NOT NULL AND CAST( pm2.meta_value AS CHAR ) > '" . $time_adj . "')";
        endif;
        // skip posts that have not started yet
        // postmeta intelliwidget_event_date date format 
        // MUST be YYYY-MM-DD HH:MM for this to work correctly!
        if ( $instance[ 'active_only' ] ):
            $clauses[] = "(pm2.meta_value IS NULL OR (pm2.meta_value IS NOT NULL AND CAST( pm2.meta_value AS CHAR ) < '" . $time_adj . "'))";
        endif;

        $order = $instance[ 'sortorder' ] == 'ASC' ? 'ASC' : 'DESC';
        switch ( $instance[ 'sortby' ] ):
            case 'event_date':
                $orderby = 'pm2.meta_value ' . $order;
                break;
            case 'rand':
                $orderby = 'RAND()';
                break;
            case 'menu_order':
                $orderby = 'p1.menu_order ' . $order;
                break;
            case 'date':
                $orderby = 'p1.post_date ' . $order;
                break;
            case 'title':
            default:
                $orderby = 'p1.post_title ' . $order;
                break;
        endswitch;
        $orderby = ' ORDER BY ' . $orderby;
        $items = intval( $instance[ 'items' ] );
        $limit = '';
        if ( !empty( $items ) ): 
            $limit = ' LIMIT 0, %d';
            $prepargs[] = $items;
        endif;
        $query = $select . implode( ' ', $joins ) . ' WHERE ' . implode( "\n AND ", $clauses ) . $orderby . $limit;
        $res      = $wpdb->get_results( $wpdb->prepare( $query, $prepargs ) );
        if ( count( $res ) ):
            $clauses = $prepargs = $ids = array();

            // now flesh out objects
            $select = "
SELECT DISTINCT
    p1.ID,
    p1.post_content, 
    p1.post_excerpt, 
    COALESCE(NULLIF(TRIM(p1.post_title), ''), " 
    . $this->prep_array( __( 'Untitled', 'intelliwidget' ), $prepargs ) . ") AS post_title,
    COALESCE(NULLIF(pm2.meta_value, ''), p1.post_date) AS post_date,
    p1.post_author,
    'raw' AS filter,
    pm1.meta_value AS expire_date, 
    pm2.meta_value AS event_date, 
    pm3.meta_value AS link_classes,
    pm4.meta_value AS alt_title,
    pm5.meta_value AS link_target,
    pm6.meta_value AS external_url,
    pm7.meta_value AS thumbnail_id
FROM {$wpdb->posts} p1
";
            $joins = array( "
LEFT JOIN {$wpdb->postmeta} pm1 ON pm1.post_id = p1.ID
    AND pm1.meta_key = 'intelliwidget_expire_date'
            ", "
LEFT JOIN {$wpdb->postmeta} pm2 ON pm2.post_id = p1.ID
    AND pm2.meta_key = 'intelliwidget_event_date'
            ", "
LEFT JOIN {$wpdb->postmeta} pm3 ON pm3.post_id = p1.ID
    AND pm3.meta_key = 'intelliwidget_link_classes'
            ", "
LEFT JOIN {$wpdb->postmeta} pm4 ON pm4.post_id = p1.ID
    AND pm4.meta_key = 'intelliwidget_alt_title'
            ", "
LEFT JOIN {$wpdb->postmeta} pm5 ON pm5.post_id = p1.ID
    AND pm5.meta_key = 'intelliwidget_link_target'
            ", "
LEFT JOIN {$wpdb->postmeta} pm6 ON pm6.post_id = p1.ID
    AND pm6.meta_key = 'intelliwidget_external_url'
            ", "
LEFT JOIN {$wpdb->postmeta} pm7 ON pm7.post_id = p1.ID
    AND pm7.meta_key = '_thumbnail_id'
            " );
            foreach ( $res as $obj )
                $ids[] = $obj->ID;
            $clauses[] = '(p1.ID IN ('. $this->prep_array( $ids, $prepargs, 'd' ) . ') )';
            $query = $select . implode( ' ', $joins ) . ' WHERE ' . implode( "\n AND ", $clauses ) . $orderby;
            $res      = $wpdb->get_results( $wpdb->prepare( $query, $prepargs ), OBJECT );
        endif;
        $this->posts = $res;
        $this->post_count = count( $res );
    }

    function prep_array( $value, &$args, $type = 's' ) {
        $values = is_array( $value ) ? $value : explode( ',', $value );
        $placeholders = array();
        foreach( $values as $val ):
            $placeholders[] = ( 'd' == $type ? '%d' : '%s' );
            $args[] = trim( $val );
        endforeach;
        return implode( ',', $placeholders );
    }
    
    /* post_list_query
     * lightweight post query for use in menus
     */
    function post_list_query( $post_types ) {
        global $wpdb;
        $args = array();
        $query = "
        SELECT
            ID,
            post_title,
            post_type,
            post_parent,
            pm.meta_id as has_profile
        FROM {$wpdb->posts}
            LEFT JOIN {$wpdb->postmeta} pm ON pm.meta_key = '_intelliwidget_map' and pm.post_id = ID 
        WHERE post_type IN (" . $this->prep_array( $post_types, $args ) . ")
            AND (post_status = 'publish' " . ( current_user_can( 'read_private_posts' ) ? " or post_status = 'private'" : '' ) . ")
            AND (post_password = '' OR post_password IS NULL)
        ORDER BY post_type, post_title
        ";
        return $wpdb->get_results( $wpdb->prepare( $query, $args ), OBJECT );
    }
    
    function terms_query( $term_ids = array() ) {
        global $wpdb;
        $args = array();
        $query = "
        SELECT t.*, tt.* 
        FROM $wpdb->terms AS t 
            INNER JOIN $wpdb->term_taxonomy AS tt ON t.term_id = tt.term_id 
        WHERE term_taxonomy_id IN (" . $this->prep_array( $term_ids, $args, 'd' ) . ")
        ORDER BY tt.count DESC
        LIMIT 1
        ";
        return $wpdb->get_row( $wpdb->prepare( $query, $args ), OBJECT );
    }
}