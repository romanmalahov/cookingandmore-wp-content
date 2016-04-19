<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * template-tags.php - Global functions for the IntelliWidget plugin.
 *
 * @package IntelliWidget
 * @subpackage includes
 * @author Jason C Fleming
 * @copyright 2014-2015 Lilaea Media LLC
 * @access public
 */
if ( !function_exists( 'get_the_intelliwidget_ID' ) ) {
    /**
     * Return the post ID
     *
     * @return <integer> post ID
     */
    function get_the_intelliwidget_ID() {
        global $intelliwidget_post;
        return $intelliwidget_post->ID;
    }
}
if ( !function_exists( 'the_intelliwidget_ID' ) ) {
    /**
     * Display the post ID
     */
    function the_intelliwidget_ID() {
        echo get_the_intelliwidget_ID();
    }
}
if ( !function_exists( 'get_the_intelliwidget_image' ) ) {
    /**
     * Return the featured post image with link to the full image.
     *
     * @global <array> $this_instance
     * @global <object> $intelliwidget_post
     * @return <string> image link if exists, <boolean> FALSE if none
     */
    function get_the_intelliwidget_image( $link = TRUE ) {
        global $this_instance, $intelliwidget_post;
        if ( $this_instance[ 'image_size' ] != 'none' && has_intelliwidget_image() ) :
            return apply_filters( 'intelliwidget_image', ( $link ? '<a title="' . strip_tags( get_the_intelliwidget_title() ) . '" href="' . get_the_intelliwidget_url() . '">' : '' )
                . get_the_post_thumbnail(
                    $intelliwidget_post->ID, 
                    $this_instance[ 'image_size' ], 
                    array(
                        'title' => strip_tags( get_the_intelliwidget_title() ), 
                        'class' =>'intelliwidget-image-'. $this_instance[ 'image_size' ],
                    )
                )
                . ( $link ? '</a>' : '' ) );
        endif;
        return FALSE;
    }
}

if ( !function_exists( 'has_intelliwidget_image' ) ) {
    /**
     * Check if the post has a featured image.
     * 
     * @global <object> $intelliwidget_post
     * @return <boolean>
     */
    function has_intelliwidget_image() {
        global $this_instance, $intelliwidget_post;
        return !( $this_instance[ 'image_size' ] == 'none' || empty( $intelliwidget_post->thumbnail_id ) );
    }
}

if ( !function_exists( 'the_intelliwidget_image' ) ) {
    /**
     * Display the featured post image with link to the full image.
     */
    function the_intelliwidget_image( $link = TRUE ) {
        echo get_the_intelliwidget_image( $link );
    }
}

if ( !function_exists( 'get_the_intelliwidget_author' ) ) {
    /**
     * Return meta data from the post author
     *
     * @param <string> $meta - field to retrieve
     * @global <object> $intelliwidget_post
     * @return <string>
     */
    function get_the_intelliwidget_author_meta( $meta ) {
        global $intelliwidget_post;
        if ( $value = get_the_author_meta( $meta, $intelliwidget_post->post_author ) ) return $value;
        return FALSE;
    }
}
if ( !function_exists( 'the_intelliwidget_author_meta' ) ) {
    /**
     * Display meta data from the post author
     *
     * @param <integer> $meta - field to retrieve
     * @return void
     */
    function the_intelliwidget_author_meta( $meta = 'display_name' ) {
        if ( $value = get_the_intelliwidget_author_meta( $meta ) ) echo $value;
    }
}

if ( !function_exists( 'get_the_intelliwidget_excerpt' ) ) {
    /**
     * Return the excerpt to display with the current post.
     *
     * @global <array> $this_instance
     * @global <object> $intelliwidget_post
     * @return <string>
     */
    function get_the_intelliwidget_excerpt() {
        global $this_instance, $intelliwidget_post;
        // use excerpt text if it exists otherwise parse the main content
        $excerpt = empty( $intelliwidget_post->post_excerpt ) ?
            get_the_intelliwidget_content() : apply_filters( 'intelliwidget_content', $intelliwidget_post->post_excerpt );
        return apply_filters( 'intelliwidget_trim_excerpt', $excerpt, $this_instance );
    }
}

if ( !function_exists( 'the_intelliwidget_excerpt' ) ) {
    /**
     * Display the excerpt for the featured post.
     */
    function the_intelliwidget_excerpt() {
        echo get_the_intelliwidget_excerpt();
    }
}

if ( !function_exists( 'get_the_intelliwidget_content' ) ) {
    /**
     * Return the excerpt to display with the current post.
     *
     * @global <object> $intelliwidget_post
     * @return <string>
     */
    function get_the_intelliwidget_content() {
        global $intelliwidget_post;
        return apply_filters( 'intelliwidget_content', $intelliwidget_post->post_content );
    }
}
    
if ( !function_exists( 'the_intelliwidget_content' ) ) {
    /**
     * Display the excerpt for the featured post.
     */
    function the_intelliwidget_content() {
        echo get_the_intelliwidget_content();
    }
}

if ( !function_exists( 'get_the_intelliwidget_link' ) ) {
    /**
     * Return a link for a post based on parameters
     *
     * @global <object> $intelliwidget_post
     * @param <integer> $post_id ( optional )
     * @param <string> $link_text ( optional ) - text inside area tag
     * @param <integer> $category_id ( optional ) - return category permalink
     * @return <string>
     */
    function get_the_intelliwidget_link( $post_id = NULL, $link_text = NULL, $category_id = NULL ) {
        global $intelliwidget_post;
        $post_id =  intval( $post_id ) ? $post_id : ( is_object( $intelliwidget_post ) ? $intelliwidget_post->ID : NULL );
        if ( isset( $category_id ) && -1 != $category_id ) $url = get_category_link( $category_id );
        $url     = isset( $url ) ? $url : get_the_intelliwidget_url( $post_id );
        if ( empty( $link_text ) ):
            $link_text = get_the_intelliwidget_title( $post_id );
        endif;
        $title_text = esc_attr( strip_tags( $link_text ) );
        $classes = empty( $intelliwidget_post->link_classes ) ? '' :  ' class="' . $intelliwidget_post->link_classes . '"';
        $target  = empty( $intelliwidget_post->link_target ) ? '' : ' target="' . $intelliwidget_post->link_target . '"';
        $content = '<a title="' . $title_text . '" href="' . $url . '"' . $classes . $target . '>' . $link_text .  '</a>';
        return apply_filters( 'intelliwidget_link', $content, $title_text, $classes, $target );
    }
}

if ( !function_exists( 'the_intelliwidget_link' ) ) {
    /**
     * Display a link for a post based on parameters
     *
     * @param <integer> $post_id ( optional )
     * @param <strong> $link_text ( optional ) - text inside area tag
     * @param <integer> $category_id ( optional ) - return category permalink
     */
    function the_intelliwidget_link( $post_id = NULL, $title = NULL ) {
        echo get_the_intelliwidget_link( $post_id, $title );
    }
}

if ( !function_exists( 'get_the_intelliwidget_url' ) ) {
    /**
     * Return a url for a post based on parameters
     *
     * @global <object> $intelliwidget_post
     * @param <integer> $post_id ( optional )
     * @param <integer> $category_id ( optional ) - return category url
     * @return <string>
     */
    function get_the_intelliwidget_url( $post_id = NULL ) {
        global $intelliwidget_post;
        $post_id = intval( $post_id ) ? $post_id : $intelliwidget_post->ID;
        return empty( $intelliwidget_post->external_url ) ? get_permalink( $post_id ) : $intelliwidget_post->external_url;
    }
}
if ( !function_exists( 'get_the_intelliwidget_taxonomy_link' ) ) {

    function get_the_intelliwidget_taxonomy_link( $title, $instance ) {
        if ( !isset( $instance[ 'query' ] ) ):
            IntelliWidget::$instance->get_query( $instance );
        endif;
        if ( isset( $instance[ 'terms' ] ) && '-1' != $instance[ 'terms' ] ):
            $term = $instance[ 'query' ]->terms_query( $instance[ 'terms' ] );
            if ( $term ):
                $url = get_term_link( $term );
                $title_text = esc_attr( strip_tags( $title ) );
                return '<a title="' . $title_text . '" href="' . $url . '">' . apply_filters( 'widget_title', $title ) .  '</a>';
            endif;
        endif;
        $post_id        = count( $instance[ 'query' ]->posts ) ? $instance[ 'query' ]->posts[ 0 ]->ID : NULL;
        $category_id    = isset( $instance[ 'category' ] ) ? $instance[ 'category' ] : NULL;
        return get_the_intelliwidget_link( $post_id, $title, $category_id );
    }
}

if ( !function_exists( 'the_intelliwidget_url' ) ) {
    /**
     * Display a url for a post based on parameters
     *
     * @param <integer> $post_id ( optional )
     * @param <integer> $category_id ( optional ) - return category url
     * @return <string>
     */
    function the_intelliwidget_url( $post_id = NULL, $category_id = NULL ) {
        echo get_the_intelliwidget_url( $post_id, $category_id );
    }
}

if ( !function_exists( 'get_the_intelliwidget_title' ) ) {
    /**
     * Get the title for the current featured post, use alt title if it exists.
     *
     * @global <object> $intelliwidget_post
     * @return <string>
     */
    function get_the_intelliwidget_title() {
        global $intelliwidget_post;
        $title = empty( $intelliwidget_post->alt_title ) ? $intelliwidget_post->post_title : $intelliwidget_post->alt_title;
        return $title; //esc_attr( $title );
    }
}
    /**
     * Display the title for the current featured post, use alt title if it exists.
     */

if ( !function_exists( 'the_intelliwidget_title' ) ) {
    function the_intelliwidget_title() {
        echo get_the_intelliwidget_title();
    }
}

if ( !function_exists( 'get_the_intelliwidget_date' ) ) {
    /**
     * Get the event date for the post if it exists, otherwise return the post date.
     *
     * @global <object> $intelliwidget_post
     * @param <string> $format
     * @return <string>
     */
    function get_the_intelliwidget_date( $format = 'j' ) {
        global $intelliwidget_post;
        $date = empty( $intelliwidget_post->event_date ) ? $intelliwidget_post->post_date : $intelliwidget_post->event_date;
        return date_i18n( $format, strtotime( $date ) );
    }
}
    /**
     * Display the event date if it exists otherwise display post date.
     */

if ( !function_exists( 'the_intelliwidget_date' ) ) {
    function the_intelliwidget_date( $format = 'j' ) {
        echo get_the_intelliwidget_date( $format );
    }
}

if ( !function_exists( 'get_the_intelliwidget_exp_date' ) ) {
    /**
     * Get the event date for the post if it exists, otherwise return the post date.
     *
     * @global <object> $intelliwidget_post
     * @param <string> $format
     * @return <string>
     */
    function get_the_intelliwidget_exp_date( $format = 'j' ) {
        global $intelliwidget_post;
        if ( empty( $intelliwidget_post->expire_date ) || 
            ( date_i18n( 'j', strtotime( $intelliwidget_post->event_date ) ) == date( 'j', strtotime( $intelliwidget_post->expire_date ) ) 
                && date_i18n( 'm', strtotime( $intelliwidget_post->event_date ) ) == date( 'm', strtotime( $intelliwidget_post->expire_date ) ) ) ):
            return FALSE;
        else:
            return date_i18n( $format, strtotime( $intelliwidget_post->expire_date ) );
        endif;
    }
}
    /**
     * Display the event date if it exists otherwise display post date.
     */

if ( !function_exists( 'the_intelliwidget_exp_date' ) ) {
    function the_intelliwidget_exp_date( $format = 'j' ) {
        if ( $exp = get_the_intelliwidget_exp_date( $format ) ) echo $exp;
    }
}

if ( !function_exists( 'intelliwidget_post_classes' ) ) {

    function intelliwidget_post_classes( &$obj, $cols = 1, $classes = array() ) {
        $seq = $obj->current_post + 1;
        $classes[] = 'post-seq-' . $seq;
        $classes[] = ( $seq % 2 === 0 ) ? 'even' : 'odd';
        if ( $cols > 1 ):
            $row_len = intval( $cols );
            $classes[] = 'cell';
            $classes[] = 'width-1-' . ( in_array( $row_len, array( 7,9,11 ) ) ? --$row_len : $row_len );
            if ( $seq % $row_len === 0 ):
                $classes[] = 'end';
            elseif ( $seq % $row_len === 1 ):
                $classes[] = 'clear';
            endif;
        endif;
        return implode( ' ', $classes );
    }
}

if ( !function_exists( 'the_intelliwidget_post_classes' ) ) {
    function the_intelliwidget_post_classes( &$obj, $cols = 1, $classes = array() ) {
        echo intelliwidget_post_classes( $obj, $cols, $classes );
    }
}

if ( !function_exists( 'get_the_intelliwidget_postmeta' ) ) {
    function get_the_intelliwidget_postmeta( $meta = NULL ) {
        global $intelliwidget_post;
        if ( $meta && ( $value = get_post_meta( $intelliwidget_post->ID, $meta, TRUE ) ) ) return $value;
        return FALSE;
    }
}

if ( !function_exists( 'the_intelliwidget_postmeta' ) ) {
    function the_intelliwidget_postmeta( $meta = NULL ) {
        echo get_the_intelliwidget_postmeta( $meta );
    }
}